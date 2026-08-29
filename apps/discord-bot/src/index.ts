import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { db } from '@skyline/database';
import { formatPaiseToINR, formatDate, getDaysRemaining, PROJECT_STATUS_MAP } from '@skyline/shared';
import { BRAND_CONFIG } from '@skyline/config';

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

if (!token || token.includes('dummy') || !clientId) {
  console.log('[Discord Bot] Discord credentials not configured or in placeholder mode. Bot running in standby simulation mode.');
} else {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  const commands = [
    new SlashCommandBuilder()
      .setName('status')
      .setDescription('Check the live development status and target deadline for a project')
      .addStringOption((option) =>
        option.setName('code').setDescription('The project code (e.g. SKY-PRJ-2026-0001)').setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName('requests')
      .setDescription('List all pending project requests awaiting quotation review'),
    new SlashCommandBuilder()
      .setName('active')
      .setDescription('List all active Skyline projects in development'),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(token);

  (async () => {
    try {
      console.log('[Discord Bot] Registering application slash commands...');
      if (guildId) {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      } else {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
      }
      console.log('[Discord Bot] Slash commands registered successfully.');
    } catch (error) {
      console.error('[Discord Bot] Error registering commands:', error);
    }
  })();

  client.on('ready', () => {
    console.log(`[Discord Bot] Logged in as ${client.user?.tag}! Operations bot ready.`);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'status') {
      const code = interaction.options.getString('code', true);
      const project = await db.project.findFirst({
        where: { projectCode: { equals: code, mode: 'insensitive' } },
        include: { customer: true },
      });

      if (!project) {
        await interaction.reply({ content: `❌ No project found with code \`${code}\`.`, ephemeral: true });
        return;
      }

      const daysLeft = getDaysRemaining(project.targetDeliveryDate);
      const statusInfo = PROJECT_STATUS_MAP[project.status];

      const embed = new EmbedBuilder()
        .setTitle(`Project: ${project.title}`)
        .setDescription(`Code: **${project.projectCode}**\nStatus: **${statusInfo?.label || project.status}**`)
        .setColor(0x3b82f6)
        .addFields(
          { name: 'Target Delivery', value: `${formatDate(project.targetDeliveryDate)} (${daysLeft > 0 ? `${daysLeft}d left` : 'Due today'})`, inline: true },
          { name: 'Total Value', value: formatPaiseToINR(project.totalPricePaise), inline: true },
          { name: 'Deposit Paid', value: `${formatPaiseToINR(project.upfrontPaidPaise)} (50%)`, inline: true },
          { name: 'Revisions', value: `${project.revisionsUsed} / ${project.revisionsIncluded} used`, inline: true }
        )
        .setFooter({ text: 'Skyline Digital Services • 2026' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else if (commandName === 'requests') {
      const requests = await db.projectRequest.findMany({
        where: { status: 'REQUESTED' },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });

      if (requests.length === 0) {
        await interaction.reply({ content: '✅ No pending project requests. All caught up!', ephemeral: true });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('🔔 Pending Project Requests')
        .setColor(0xf59e0b)
        .setDescription(
          requests
            .map((r) => `• **${r.trackingCode}** — ${r.name} (${r.projectType}) | Budget: ${r.budgetRange}`)
            .join('\n')
        )
        .setFooter({ text: 'Open Skyline Admin to build itemized quotes.' });

      await interaction.reply({ embeds: [embed] });
    } else if (commandName === 'active') {
      const activeProjects = await db.project.findMany({
        where: { status: { in: ['IN_PROGRESS', 'INTERNAL_QA', 'CUSTOMER_REVIEW', 'REVISION'] } },
        orderBy: { targetDeliveryDate: 'asc' },
      });

      const embed = new EmbedBuilder()
        .setTitle(`🚀 Active Projects in Development (${activeProjects.length})`)
        .setColor(0x10b981)
        .setDescription(
          activeProjects
            .map((p) => `• **${p.projectCode}** — ${p.title} (${PROJECT_STATUS_MAP[p.status]?.label}) | Due: ${formatDate(p.targetDeliveryDate)}`)
            .join('\n') || 'No active projects currently in development.'
        );

      await interaction.reply({ embeds: [embed] });
    }
  });

  client.login(token).catch((err) => console.error('[Discord Bot] Login error:', err));
}

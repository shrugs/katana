import { memoSingleton } from '@lib/repos/MemoSingleton';
import { Api, TelegramClient } from 'telegram';
import { MemorySession } from 'telegram/sessions';
import BigInteger from 'big-integer';

export interface ChannelInfo {
  channelId: number;
  accessHash: string;
}

export interface UserInfo {
  userId: number;
  accessHash: string;
}

const toApiChannel = ({ channelId, accessHash }: ChannelInfo) =>
  new Api.InputChannel({
    channelId,
    accessHash: BigInteger(accessHash),
  });

const toApiUser = ({ userId, accessHash }: UserInfo) =>
  new Api.InputUser({
    userId,
    accessHash: BigInteger(accessHash),
  });

const getBotClient = memoSingleton(async () => {
  const session = new MemorySession();

  const client = new TelegramClient(
    session,
    parseInt(process.env.TELEGRAM_APP_ID),
    process.env.TELEGRAM_APP_HASH,
    { connectionRetries: 5 },
  );

  await client.connect();
  await client.start({ botAuthToken: process.env.TELEGRAM_BOT_AUTH_TOKEN });

  return client;
});

export async function getChannelInfo(username: string): Promise<ChannelInfo> {
  const client = await getBotClient();
  const response = await client.invoke(new Api.contacts.ResolveUsername({ username }));
  const channel = response.chats[0] as Api.Channel;
  return { channelId: channel.id, accessHash: channel.accessHash.toString() };
}

export async function addToChannel(channel: ChannelInfo, user: UserInfo) {
  const client = await getBotClient();
  return await client.invoke(
    new Api.channels.InviteToChannel({
      channel: toApiChannel(channel),
      users: [toApiUser(user)],
    }),
  );
}

export async function removeFromChannel(channel: ChannelInfo, participant: UserInfo) {
  const client = await getBotClient();
  return await client.invoke(
    new Api.channels.EditBanned({
      channel: toApiChannel(channel),
      participant: toApiUser(participant),
      // https://core.telegram.org/constructor/chatBannedRights
      bannedRights: new Api.ChatBannedRights({ viewMessages: true, untilDate: 1 }),
    }),
  );
}

export async function sendMessage(peer: ChannelInfo, message: string) {
  const client = await getBotClient();
  return await client.invoke(
    new Api.messages.SendMessage({
      peer: toApiChannel(peer),
      message,
    }),
  );
}

export async function isInChannel(channel: Api.InputChannel, participant: Api.InputUser) {
  const client = await getBotClient();
  return await client.invoke(new Api.channels.GetParticipant({ channel, participant }));
}

const discordFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (options.method === 'PUT') {
    return;
  }

  try {
    const data = await res.json();
    if (res.status >= 400) throw new Error(`${data.code} ${data.message}`);
    return data;
  } catch (error) {
    throw new Error(res.statusText);
  }
};

export const getFromServer = async (userID: string) => {
  return discordFetch(
    `https://discord.com/api/v8/guilds/${
      process.env.DISCORD_SERVER_ID as string
    }/members/${userID}`,
    {
      method: 'GET',
    },
  );
};

export const addToServer = async (userID: string, accessToken: string) => {
  return discordFetch(
    `https://discord.com/api/v8/guilds/${
      process.env.DISCORD_SERVER_ID as string
    }/members/${userID}`,
    {
      method: 'PUT',
      body: JSON.stringify({ access_token: accessToken }),
    },
  );
};

export const removeFromServer = async (userID: string) => {
  return discordFetch(
    `https://discord.com/api/v8/guilds/${
      process.env.DISCORD_SERVER_ID as string
    }/members/${userID}`,
    {
      method: 'DELETE',
    },
  );
};

export const getRolesForUser = async (userId: string) => {
  return discordFetch(
    `https://discord.com/api/v8/guilds/${process.env.DISCORD_SERVER_ID}/members/${userId}`,
    { method: 'GET' },
  );
};

export const setRolesForUser = async (roles: string[], userID: string) => {
  return discordFetch(
    `https://discord.com/api/v8/guilds/${process.env.DISCORD_SERVER_ID}/members/${userID}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ roles }),
    },
  );
};
export const addRoleForUser = async (roleId: string, userID: string) => {
  return discordFetch(
    `https://discord.com/api/v8/guilds/${process.env.DISCORD_SERVER_ID}/members/${userID}/roles/${roleId}`,
    {
      method: 'PUT',
    },
  );
};
export const removeRoleForUser = async (roleId: string, userID: string) => {
  await discordFetch(
    `https://discord.com/api/v8/guilds/${process.env.DISCORD_SERVER_ID}/members/${userID}/roles/${roleId}`,
    {
      method: 'DELETE',
    },
  );
};

export const RolesToIDs: Record<string, string> = {
  // eslint-disable-next-line prettier/prettier
  'Katana': '883011694241120346',
  'Katana of Power': '883011852165062668',
  'Katana of Detection': '883011903440429056',
  'Katana of Perfection': '883013555685851138',
  'Katana of Reflection': '883011951674925086',
  'Katana of Fury': '883011999620005929',
  'Katana of Vitriol': '883012045660893224',
  'Katana of Rage': '883012164498104350',
  'Katana of the Fox': '883012198748811355',
  'Katana of Skill': '883012239303508019',
  'Katana of Brilliance': '883012276557340743',
  'Katana of Titans': '883012321637703720',
  'Katana of Protection': '883012362427310200',
  'Katana of Enlightenment': '883012404466823199',
  'Katana of the Twins': '883012449010343936',
  'Katana of Anger': '883012491330879590',
  'Katana of Giants': '883012524222578759',
};

const discordFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (options.method === 'PUT') {
    const message = await res.text();
    if (res.status >= 400) throw new Error(`${res.status} ${res.statusText} ${message}`);
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

export const getFromServer = async (guildId: string, userId: string) => {
  return discordFetch(`https://discord.com/api/v8/guilds/${guildId}/members/${userId}`, {
    method: 'GET',
  });
};

export const addToServer = async (guildId: string, userId: string, accessToken: string) => {
  return discordFetch(`https://discord.com/api/v8/guilds/${guildId}/members/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ access_token: accessToken }),
  });
};

export const removeFromServer = async (guildId: string, userId: string) => {
  return discordFetch(`https://discord.com/api/v8/guilds/${guildId}/members/${userId}`, {
    method: 'DELETE',
  });
};

export const getRolesForUser = async (guildId: string, userId: string) => {
  return discordFetch(`https://discord.com/api/v8/guilds/${guildId}/members/${userId}`, {
    method: 'GET',
  });
};

export const setRolesForUser = async (guildId: string, userId: string, roles: string[]) => {
  return discordFetch(`https://discord.com/api/v8/guilds/${guildId}/members/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ roles }),
  });
};

export const addRoleForUser = async (guildId: string, userId: string, roleId: string) => {
  return discordFetch(
    `https://discord.com/api/v8/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    {
      method: 'PUT',
    },
  );
};
export const removeRoleForUser = async (guildId: string, roleId: string, userId: string) => {
  await discordFetch(
    `https://discord.com/api/v8/guilds/${guildId}/members/${userId}/roles/${roleId}`,
    {
      method: 'DELETE',
    },
  );
};

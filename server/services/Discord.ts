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
  'Katana': '882674757525467167',
  'Katana of Power': '882674815000006666',
  'Katana of Detection': '882675234396848149',
  'Katana of Perfection': '882675394531188787',
  'Katana of Reflection': '882675435597602886',
  'Katana of Fury': '882675474575286352',
  'Katana of Vitriol': '882675531257102397',
  'Katana of Rage': '882675576886943804',
  'Katana of the Fox': '882675612467220490',
  'Katana of Skill': '882675648643092553',
  'Katana of Brilliance': '882675691177521182',
  'Katana of Titans': '882675735280640100',
  'Katana of Protection': '882675772597346335',
  'Katana of Enlightenment': '882675820320145428',
  'Katana of the Twins': '882675858094063616',
  'Katana of Anger': '882675894995533845',
  'Katana of Giants': '882675927040024637',
};

export const AdminRoleID = '882637635976302632';

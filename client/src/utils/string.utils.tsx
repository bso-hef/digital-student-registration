export const onlyInitials = (line: string) => {
  const name = line;
  const rgx = /(\p{L}{1})\p{L}+/gu;

  const initials = [...name.matchAll(rgx)];

  const result = (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "");

  return result.toUpperCase();
};

export const userInitials = (firstName: string, lastName: string) => {
  if (!firstName && lastName) return onlyInitials(lastName);
  if (firstName && !lastName) return onlyInitials(firstName);
  if (!firstName && !lastName) return " ";

  return `${onlyInitials(firstName)}${onlyInitials(lastName)}`;
};

type User = {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  deviceName?: string;
  name?: string;
};

export const getName = (user: User) => {
  let name = "";
  if (user && user.firstName) {
    name = `${user.firstName} ${user.lastName ? user.lastName : ""}`;
  } else if (user && user.userName) {
    name = user.userName;
  } else if (user && user.email) {
    name = user.email;
  } else if (user && user.deviceName) {
    name = user.deviceName;
  } else if (user && user.name) {
    name = user.name;
  } else {
    name = "";
  }

  return name;
};

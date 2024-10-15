type Link = {
  name: string;
  href: string;
};

type User = {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  avatar?: Buffer | null;
  password?: string | null;
  accounts?: Account[];
  sessions?: Session[];
  families?: FamilyMember[];
  invitations?: FamilyInvitation[];
  authenticators?: Authenticator[];
  createdAt: Date;
  updatedAt: Date;
};

type Account = {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
};

type Session = {
  sessionToken: string;
  userId: string;
  expires: Date;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
};

type VerificationToken = {
  identifier: string;
  token: string;
  expires: Date;
};

type Authenticator = {
  credentialID: string;
  userId: string;
  providerAccountId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string | null;
  user?: User;
};

type Family = {
  id: string;
  name: string;
  members?: FamilyMember[];
  shoppingLists?: ShoppingList[];
  invitations?: FamilyInvitation[];
  createdAt: Date;
  updatedAt: Date;
};

type FamilyMember = {
  id: string;
  familyId: string;
  userId: string;
  role: string; // e.g., "owner", "member"
  family?: Family;
  user?: User;
};

type FamilyInvitation = {
  id: string;
  familyId: string;
  userId: string;
  status: string; // "pending", "accepted", "rejected"
  family?: Family;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
};

type ShoppingList = {
  id: string;
  familyId: string;
  name: string;
  items?: ShoppingItem[];
  family?: Family;
  createdAt: Date;
  updatedAt: Date;
};

type ShoppingItem = {
  id: string;
  shoppingListId: string;
  customProductName?: string | null;
  quantity: number;
  isChecked: boolean;
  shoppingList?: ShoppingList;
};

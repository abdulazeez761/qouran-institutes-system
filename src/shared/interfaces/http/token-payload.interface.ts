import { Role } from 'shared/enums/role.enum';

export interface PrivateTokenPayloadI {
  sub: string;
  role: Role;
}

export interface PublicTokenPayloadI {
  role: Role;
}

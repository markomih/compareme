import {Table} from "./table";
export class User {
  email: string;
  name: string;
  password: string;
  token: string = null;
  tables:Array<Table> = [];
}

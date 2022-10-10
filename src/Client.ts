export default class Client {
  /** ID. */
  private id: number;
  /** 姓. */
  private familyname: string;
  /** 名. */
  private firstname: string;
  /** 住所. */
  private address: string;
  /** 生成日時. */
  private createdAt: Date;
  /** 編集時のチェックボックスの有効状態 */
  private isEditHidden: Boolean = true;

  constructor(id: number, familyname: string, firstname: string, address: string, createdAt: Date) {
    this.id = id;
    this.familyname = familyname;
    this.firstname = firstname;
    this.address = address;
    this.createdAt = createdAt;
  }
}
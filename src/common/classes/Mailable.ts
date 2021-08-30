export abstract class Mailable {
  protected to: string;

  protected subject: string;

  protected template: string;

  protected context: string;

  constructor(to: string, subject: string, template: string, context: string) {}

  public send() {}
}

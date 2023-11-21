export class User {
    // private fields
    private _id: number;
    private _username: string;
    private _email: string;
    private _firstname: string;
    private _lastname: string;

    // De constructor wordt eenmalig aangeroepen als de class wordt geïnstantieerd.
    // Deze constructor vult de fields bij het aanmaken van een object.
    public constructor(id: number, username: string, email: string, firstname: string, lastname: string) {
        this._id = id;
        this._username = username;
        this._email = email;
        this._firstname = firstname;
        this._lastname = lastname;
    }

    // Getters en setters
    public get id(): number {
        return this._id;
    }

    public get username(): string {
        return this._username;
    }

    public get email(): string {
        return this._email;
    }

    public get firstname(): string {
        return this._firstname;
    }

    public get lastname(): string {
        return this._lastname;
    }

    public set id(value: number) {
        this._id = value;
    }

    public set username(value: string) {
        this._username = value;
    }

    public set email(value: string) {
        this._email = value;
    }

    public set firstname(value: string) {
        this._firstname = value;
    }

    public set lastname(value: string) {
        this._lastname = value;
    }

    public toString(): string {
        return `User: ${this._id} ${this._username} ${this._email} ${this._firstname} ${this._lastname}`;
    }
}

class People {
    constructor(firstName, lastName, birthday, sex) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthday = birthday;
        this.sex = sex || 'F';

    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get age() {
        return new Date().getFullYear() - (this.birthday).getFullYear();
    }
    get userName() {
        let userName = `${this.firstName} ${this.lastName}`;
        for (let i = 0; i < userName.length; i++) userName = userName.replace(' ', '_');

        return userName;
    }

}
module.exports = People;
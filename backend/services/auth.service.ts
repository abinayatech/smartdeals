export class AuthService {

    login(email: string, password: string) {

        return {
            email,
            token: "demo-token"
        };

    }

}
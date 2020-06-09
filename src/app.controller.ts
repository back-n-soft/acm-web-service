import {Controller, Get, Param} from '@nestjs/common';
import {UserService} from "./users/user.service";

@Controller()
export class AppController {
    constructor(private readonly userService: UserService) {}

    @Get('verify/:uuid')
    async confirmUserRegistration(@Param('uuid') uuid: string) {
        const user = await this.userService.findByConfirmationId(uuid);
        if (!user) {
            return '<h2>Confirmation Failed!</h2>' +
                '<br>Sorry, could not find an user with the given uuid.' +
                '<br>Maybe you clicked an expired link!';
        }
        const result = await this.userService.confirmUser(user);
        if (result){
            return "<h2>Confirmation successful!</h2>"
        }
        return "<h2>Sorry, an error occurred!</h2>"
    }
}
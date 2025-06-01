import Service from '../service';

const Controller = {
    login(token) {
        return Service().signIn(token);
    }
}

export default Controller;

type TimeType = any; //string | number | NodeJS.Timeout | undefined | void;
class TimerConstants {
    static duration = 5000; //1000 * 60 * 15;
    static getLocalStorageTimer = (): any => localStorage.getItem('timer');
    static setLocalStorageTimer = (): void => localStorage.setItem('timer', new Date().getTime().toString());
}
export class IdleTimeDetector {
    private timeout: TimeType;
    private timeoutInterval: TimeType;
    private timerDuration: number = TimerConstants.duration;
    private startingTime: number | null = 0;
    constructor() {}
    run = () => {
        const idleTimeLocalStorage = TimerConstants.getLocalStorageTimer();
        if (idleTimeLocalStorage) {
            this.startingTime = Number(idleTimeLocalStorage);
            this.handleIdle();
        } else this.startTimer();
    };
    initListeners = () => {
        console.log('__ Inside init listeners __');
        document.addEventListener('load', this.onActivity);
        document.addEventListener('mousemove', this.onActivity);
        document.addEventListener('mousedown', this.onActivity); // catches touchscreen presses as well
        document.addEventListener('touchstart', this.onActivity); // catches touchscreen swipes as well
        document.addEventListener('touchmove', this.onActivity); // required by some devices
        document.addEventListener('click', this.onActivity); // catches touchpad clicks as well
        document.addEventListener('keydown', this.onActivity);
        document.addEventListener('scroll', this.onActivity, true); // improved; see comments
    };
    removeListeners = () => {
        document.removeEventListener('load', this.onActivity);
        document.removeEventListener('mousemove', this.onActivity);
        document.removeEventListener('mousedown', this.onActivity); // catches touchscreen presses as well
        document.removeEventListener('touchstart', this.onActivity); // catches touchscreen swipes as well
        document.removeEventListener('touchmove', this.onActivity); // required by some devices
        document.removeEventListener('click', this.onActivity); // catches touchpad clicks as well
        document.removeEventListener('keydown', this.onActivity);
        document.removeEventListener('scroll', this.onActivity, true); // improved; see comments
    };
    startTimer = () => {
        console.log('__ Starting Timer __');
        if (this.timeoutInterval) clearInterval(this.timeoutInterval);
        // localStorage.setItem('timer', new Date().getTime().toString());
        TimerConstants.setLocalStorageTimer();
        this.timeout = setTimeout(this.logout, this.timerDuration);
        this.initListeners();
    };
    handleUnidle = () => {
        // console.log('__ Inside Un-Idle __');
    };
    handleIdle = () => {
        // console.log('__ Inside Idle __');
        this.timeoutInterval = setInterval(() => {
            if (this.startingTime === null) this.startingTime = new Date().getTime();
            const timeDiff = new Date().getTime() - this.startingTime;
            if (timeDiff >= this.timerDuration) {
                clearInterval(this.timeoutInterval);
                this.removeListeners();
                this.logout();
                setTimeout(this.startTimer, this.timerDuration);
            }
        }, 1000);
        this.initListeners();
    };
    onActivity = () => {
        if (this.timeout) clearTimeout(this.timeout);
        else this.handleUnidle();
        // console.log('__ Reset Timer __');
        this.removeListeners();
        setTimeout(this.startTimer, this.timerDuration);
    };
    logout = () => {
        this.timeout = 0;
        // console.log('logging out');
        alert('You are now logged out.');
    };
}

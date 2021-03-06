function judgeMainPage() {
    for (var i = 1; i <= 5; i++) {
        sleep(300);
        console.log('第' + i + '次校验是否主页');
        if (text('扫一扫').exists() && text('付钱/收钱').exists() && text('出行').exists() && text('首页').exists()) {
            return true;
        }
        if (text('首页').exists() && text('理财').exists() && text('口碑').exists()) {
            id('com.alipay.android.phone.openplatform:id/tab_description').text('首页').findOnce().parent().click()
        }
    }
    return false;
}

function enterMainPage() {
    var i = 0;
    while (currentPackage() != getPackageName('支付宝')) {
        launchApp('支付宝');
        if (i > 5) {
            toastLog('5次启动支付宝失败');
            device.vibrate(2000);
            exit();
        }
        i++;
        sleep(500);
    }
    for (var i = 0; i < 10; i++) {
        if (judgeMainPage())
            return true;
        leftSwipe();
    }
    return false;
}

function leftSwipe() {
    setScreenMetrics(1440, 3200);
    swipe(1400, 1600, 1000, 1600, 400);
    sleep(500);
}

function downSwpie() {
    setScreenMetrics(1440, 3200);
    swipe(720, 50, 720, 550, 350);
    sleep(500);
}

function upSwipe() {
    setScreenMetrics(1440, 3200);
    swipe(720, 3160, 720, 1100, 350);
    sleep(500);
}

function enterManor() {
    var manor = text('蚂蚁庄园').findOnce();
    while (manor.parent()) {
        if (manor.parent().clickable()) {
            manor.parent().click();
            return true;
        }
        manor = manor.parent();
    }
    return false;
}

function judgeManor() {
    for (var i = 1; i <= 5; i++) {
        console.log('第' + i + '次校验庄园');
        sleep(500);
        if (text('蚂蚁庄园').exists() && desc('更多').exists() && desc('关闭').exists()) {
            return true;
        }
    }
    return false;
}

function clickPasswd(passwd) {
    for (i = 0; i < passwd.length; i++) {
        desc(Number(passwd.charAt(i))).findOnce().click();
        sleep(500);
    }
}


function unlock() {
    if (!device.isScreenOn()) {
        var i = 0;
        //点亮屏幕
        while (!device.isScreenOn()) {
            device.wakeUp();
            //由于MIUI的解锁有变速检测，因此要点开时间以进入密码界面
            sleep(1000);
            i++;
            if (i > 10) {
                toastLog('无法唤醒屏幕');
                device.vibrate(2000);
                exit();
            }
        }
        upSwipe();
        //输入屏幕解锁密码
        clickPasswd('123456');
        return true;
    }
    return false;
}


function main() {
    var lock_flag = 0;
    if (unlock()) {
        lock_flag = 1;
    } else {
        now_app = currentPackage();
    }
    if (enterMainPage()) {
        enterManor();
        if (judgeManor()) {
            sleep(2000);
            press(1250, 2950, 350);
            sleep(2000);
            upSwipe();
            if (lock_flag == 0) {
                var i = 0;
                do {
                    launch(now_app);
                    i++;
                } while (currentPackage() != now_app && i < 5)
                return;
            }
            downSwpie();
            downSwpie();
            desc('锁屏').findOnce().parent().click();
        }
    }
}

setScreenMetrics(1440, 3200);
main();

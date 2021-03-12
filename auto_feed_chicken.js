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
        back();
        sleep(1000);
    }
    return false;
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
        var j = 0;
        do {
            j++;
            swipe(720, 3100, 720, 1100, 350);
            sleep(500);
            if (j > 5) {
                toastLog("解锁界面开启失败");
                exit();
            }
        } while (!desc(1).findOnce())
        //输入屏幕解锁密码
        clickPasswd('123456');
        return true;
    }
    return false;
}

function main() {
    setScreenMetrics(1440, 3200);
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
            home();
            sleep(1000)
            if (lock_flag == 0) {
                var i = 0;
                do {
                    launch(now_app);
                    i++;
                    sleep(200);
                } while (currentPackage() != now_app && i < 5)
                return;
            }
            quickSettings();
            sleep(1000);
            desc('锁屏').findOnce().parent().click();
        }
    }
}

main();

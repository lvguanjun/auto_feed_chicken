function selfUnlock(passwd) {
    lock_flag = true;
    current_app = null;
    if (device.isScreenOn()) {
        lock_flag = false;
        current_app = app.getAppName(currentPackage());
        if (!dialogs.confirm('auto_feed_chicken', '当前应用为' + current_app + ', 是否自动喂鸡')) {
            exit();
        }
    } else {
        var i = 0;
        do {
            device.wakeUpIfNeeded();
            sleep(1000);
            swipe(720, 3100, 720, 1100, 350);
            i++;
            if (i > 5) {
                toastLog('解锁界面进入失败');
                exit();
            }
        } while (!desc(1).findOnce())
        clickPasswd(passwd);
    }
    return [lock_flag, current_app];
}

function clickPasswd(passwd) {
    for (i = 0; i < passwd.length; i++) {
        desc(Number(passwd.charAt(i))).findOnce().click();
        sleep(500);
    }
}

function enterManor() {
    var i = 0;
    while (app.getAppName(currentPackage()) != '支付宝') {
        launchApp('支付宝');
        i++;
        sleep(500);
        if (i > 5) {
            toastLog('启动支付宝失败');
            exit();
        }
    }
    if (!judgeManor()) {
        var i = 0;
        while (!judgeMainPage()) {
            back();
            if (judgeManor()) {
                return;
            }
            sleep(1000);
            i++;
            if (i > 10) {
                toastLog('进入支付包首页失败');
                exit();
            }
        }
        var manor = text('蚂蚁庄园').findOnce();
        while (manor.parent()) {
            if (manor.parent().clickable()) {
                manor.parent().click();
                return;
            }
            manor = manor.parent();
        }
        toastLog('进入庄园失败');
        exit();
    }
}

function judgeManor() {
    for (var i = 1; i <= 3; i++) {
        console.log('第' + i + '次校验庄园');
        sleep(500);
        if (text('蚂蚁庄园').exists() && desc('更多').exists() && desc('关闭').exists()) {
            return true;
        }
    }
    return false;
}

function judgeMainPage() {
    for (var i = 1; i <= 3; i++) {
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

function main() {
    setScreenMetrics(1440, 3200);
    var passwd = '123456';
    let [lock_flag, current_app] = selfUnlock(passwd);
    enterManor();
    sleep(2000);
    press(1250, 2950, 350);
    sleep(2000);
    if (lock_flag) {
        home();
        sleep(2000);
        quickSettings();
        sleep(1000);
        desc('锁屏').findOnce().parent().click();
    } else {
        switch (current_app) {
            case '搜狗输入法':
            case '系统桌面':
                home();
                break;
        }
        for (var i = 0; i < 5 && app.getAppName(currentPackage()) != current_app; i++) {
            launchApp(current_app);
            sleep(500);
        }
    }
}

main();

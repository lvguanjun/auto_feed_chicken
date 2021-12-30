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
    home();
    while (app.getAppName(currentPackage()) != '支付宝') {
        launchApp('支付宝');
        i++;
        sleep(500);
        if (i > 8) {
            toastLog('启动支付宝失败');
            exit();
        }
    }
    if (!judgeManor()) {
        var i = 0;
        while (!judgeMainPage()) {
            back();
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
                if (judgeManor()) {
                    return;
                }
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
            // 通过判断两点颜色是否一致，确认已进入庄园而不是加载界面（加载界面为同色背景）
            // 若20次（4秒）均判断两点颜色一致，强行认为进入蚂蚁庄园，方便后续还原环境处理
            for (var j = 1; j <= 20; j++) {
                if (!judgeScreenTwoPonitColorSame(300, 2700, 1000, 500)) {
                    break
                }
                console.log('庄园加载界面共计' + j * 200 + '毫秒')
                sleep(200)
            }
            console.log('成功进入庄园')
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
            console.log('进入主页成功')
            return true;
        }
        if (text('首页').exists() && text('理财').exists() && text('口碑').exists()) {
            id('com.alipay.android.phone.openplatform:id/tab_description').text('首页').findOnce().parent().click()
        }
    }
    return false;
}

function judgeScreenTwoPonitColorSame(x1, y1, x2, y2) {
    var img = captureScreen();
    var color1 = images.pixel(img, x1, y1);
    color1 = colors.toString(color1);
    var color2 = images.pixel(img, x2, y2);
    color2 = colors.toString(color2);
    if (color1 == color2) {
        console.log('color = ' + color1)
        return true;
    } else {
        console.log('color1 = ' + color1)
        console.log('color2 = ' + color2)
        return false;
    }
}

function main() {
    setScreenMetrics(1440, 3200);
    var passwd = '123456';
    let [lock_flag, current_app] = selfUnlock(passwd);
    sleep(1000);
    for (var i = 0; i < 5; i++) {
        if (!requestScreenCapture()) {
            toastLog("截图请求失败" + i + "次");
            sleep(500);
        } else {
            break;
        }
    }
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
                return;
        }
        for (var i = 0; i < 5 && app.getAppName(currentPackage()) != current_app; i++) {
            launchApp(current_app);
            sleep(500);
        }
    }
}

main();


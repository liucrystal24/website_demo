$(document).ready(function () {
    var mySwiper1 = new Swiper('.banner.swiper_on', {
        loop: true,
        autoplay: 2000,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        centeredSlides: false,
        paginationClickable: true,

        // // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',

        // // 如果需要滚动条
        // scrollbar: '.swiper-scrollbar',
    });
    var mySwiper3 = new Swiper('.dynamics.swiper_on', {
        loop: true,
        autoplay: 2000,
        slidesPerView: 4,
        centeredSlides: false,
        paginationClickable: true,
        spaceBetween: 15,
        // // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',

        // // 如果需要滚动条
        // scrollbar: '.swiper-scrollbar',
    });
    var ratio = 1920 / 550;
    setBannerHeight();
    $(window).resize(setBannerHeight);

    function setBannerHeight() {
        var banner = $(window).width();
        $('.banner img').height((1200 > banner ? 1200 : banner) / ratio);
        if (1920 < banner) {
            $('body').css('zoom', banner / 1920);
        }
        else {
            $('body').css('zoom', 1);
        }
    }

    var mySwiper2 = new Swiper('.honour.swiper_on', {
        slidesPerView: 'auto',
        // 如果需要分页器
        // pagination: '.swiper-pagination',

        // // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',

        // // 如果需要滚动条
        // scrollbar: '.swiper-scrollbar',
    });

    // 头部搜索
    $('button.search').click(function (e) {
        e.stopPropagation();
        var search_key = $(this).prev().val();
        if (!search_key) {
            ShowTip({Status: 0, Message: '请输入关键字'});
            $(this).prev().focus();
            return;
        }
        keywords_search(search_key);
        countSearch(search_key);
    });
    $('.search_btn').click(function () {
        var search_key = $(this).prev().val();
        if (!$.trim(search_key)) {
            $(this).prev().focus();
            return;
        }
        keywords_search(search_key);
        countSearch(search_key);
        return;
    });

    function countSearch(keyword) {
        $.ajax({
            type: 'post',
            cache: false,
            dataType: 'json',
            url: '/index.php?m=formguide&c=index&a=submit&formid=25&siteid=1',
            data: {info: {keyword: keyword}},
            beforeSubmit: function () {
            },
            success: function () {
            },
            error: function () {
            }
        });
    }

    $('[name=keyword]').keyup(function (e) {
        var keycode = window.event ? e.keyCode : e.which;//获取按键编码
        if (keycode == 13) {
            keywords_search($(this).val());
        }
    }).focus(function (e) {
        $('.header .search-result').slideDown(200);
        e.stopPropagation();
    }).click(function (e) {
        e.stopPropagation();
    });
    $('.header .search-result li').click(function (e) {
        var search_key = $(this).text();
        keywords_search(search_key);
        $('.header .search-result').slideUp(200);
        e.stopPropagation();
    });

    function keywords_search(data) {
        var url = '/search?k=' + data;
        window.location.href = url;

    }

    // 表单操作
    var ext = '', formId = '', name = '';
    $(document).on('click', '.form_show', function () {
        $('.form_layyer').addClass('show');
        $('.form_layyer h4').text($(this).attr('data-title') || $(this).text() || '立即咨询');
        ext = $(this).attr('data-location');
        formId = $(this).data('form') || 20;
        name = $(this).parents('li').find('.name').text() || $(this).parents('.activity-sign-up').find('.name').text() || '';
    });
    $(document).on('click', '#ywtSubmit', function () {
        $('.form_layyer').removeClass('show');
    })
    $('.ywt_close').on('click',function(){
        $('.form_layyer').removeClass('show');
    })

    $('.to-employ').on('click', function () {
        $('.resume_layer').addClass('show');
        $('.resume_layer [name="info[job]"]').val($(this).parents('.list_item').find('.td_1').text());
        $('.resume_layer [name="email').val($(this).parents('.list_item').find('.item_title').attr('data-email'));
        formId = $(this).data('form') || 20;
    });
    $('[name="files"]').change(function () {
        $(this).prevAll('[name="filename"]').val($(this).val());
    });
    $(window).on('click', function () {
        $('.header .search-result').slideUp(200);
    });

    $('.form_close').click(function () {
        $('[name=username],[name=phone],[name="info[job]"],[name="files"],[name="filename"]').val('');
        $('.form_layyer,.resume_layer').removeClass('show');
    });
    $('[name=username]').change(function () {
        check_form();
    });
    $('[name=phone],[name="info[phone]"]').change(function () {
        check_form();
    });
    $('.resume_layer input[type="submit"]').click(function () {
        var isPass = check_form();
        if (!isPass)
            return false;

        if ('' == $('.resume_layer [name="info[phone]"]').val()) {
            $('.error_txt').addClass('show').text('手机号不能为空');
            return false;
        }
        var file = $('#files').val();
        var email = $('.resume_layer [name="email"]').val();
        var job = $('.resume_layer [name="info[job]"]').val();
        var name = $('.resume_layer [name="username"]').val();
        var phone = $('.resume_layer [name="info[phone]"]').val();
        var btn = $(this);
        if (file) {
            var ext = file.split('.').pop();
            if ('doc' !== ext && 'docx' !== ext && 'pdf' !== ext) {
                $('.error_txt').addClass('show').text('请提供doc,docx,pdf格式的简历');
                return false;
            }
        }
        btn.attr('disabled', 'disabled').val('正在提交...');
        $.ajaxFileUpload({
            url: '/index.php?m=formguide&c=index&a=submit&formid=22&siteid=1',
            data: {
                username: name,
                email: email,
                info: {
                    job: job,
                    phone: phone
                }
            },
            type: 'post',
            fileElementId: 'files',//文件选择框的id属性
            dataType: 'json',
            async: false,
            success: function (data) {
                ShowTip(data);
                $('.resume_layer').removeClass('show').find('input[name="files"],input[name="filename"],input[name="info[phone]"],input[name="username"]').val('');
                btn.attr('disabled', false).val('提交');
            },
            error: function (data, status, e) {
                ShowTip(data);
                btn.attr('disabled', false).val('提交');
            }
        });
        // $.ajax({
        //     type: 'post',
        //     cache: false,
        //     dataType: 'json',
        //     url: '/index.php?m=formguide&c=index&a=submit&formid=22&siteid=1',
        //     data: {'username: name, email: email, info: {job: job, phone: phone}},
        //     beforeSubmit: function () {
        //         // alert("我在提交表单之前被调用！");
        //     },
        //     success: function (data) {
        //         if (typeof(data) == "string") {
        //             data = eval('(' + data + ')');
        //             //alert(data); object
        //             handle(data);
        //         } else {
        //             handle(data);
        //         }
        //
        //     }
        // });
        return false;
    });

    function check_form() {
        var reg = /1[3|4|5|7|8|][0-9]{9}/;
        if (!$('[name=username]').val().trim()) {
            $('.error_txt').addClass('show').text('姓名不能为空');
            return false;
        }
        if (!reg.test($('[name=phone],[name="info[phone]"]').val()) && $('[name=phone],[name="info[phone]"]').val() != '') {
            $('.error_txt').addClass('show').text('请填写正确的手机号');
            return false;
        }
        $('.error_txt').removeClass('show').text('');
        return true;
    }

    $('.form_btn').click(function (e) {
        e.preventDefault();
        submit_form();
    });
    $('#form_data').submit(function (e) {
        e.preventDefault();
        submit_form();
    });
    // $('.resume-now').click(function () {
    //     // $('.resume_layer').removeClass('show');
    //     ShowTip({Status: 1, Message: '感谢您的参与，小胜将尽快联系您！'})
    // });

    //统计代码

var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?14307270ac89b27d051e58396b1b8362";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();


    function submit_form() {
        var reg = /1[3|4|5|6|7|8|][0-9]{9}/;
        if (!$('[name=username]').val().trim()) {
            $('.error_txt').addClass('show').text('姓名不能为空');
            return false;
        }
        if (!reg.test($('[name=phone],[name="info[phone]"]').val())) {
            $('.error_txt').addClass('show').text('请填写正确的手机号');
            return false;
        }

        // var data = $('#form_data').serialize();
        // data += ext;
        var data = {
            username: $('[name=username]').val().trim(),
            phone: $('[name=phone],[name="info[phone]"]').val(),
            info:
                {
                    url: window.location.href.split('/').pop() || '首页',
                    phone: $('[name=phone],[name="info[phone]"]').val(),
                    company: $('[name=company]').val()
                }
        };
        if (20 === formId) {
            data.info.location = ext;
        }
        if (21 === formId) {
            data.info.act_name = name;
        }
        var url = '/index.php?m=formguide&c=index&a=submit&formid=' + formId + '&siteid=1';
        $.post(url, data, function (res) {
            ShowTip(res);
            $('.form_layyer').removeClass('show');
        }, 'json');

    }

    // 地图
    var map_data = {
        '黑龙江省': '哈尔滨宣化街595号南岗区盟科官邸A1座804室',
        '吉林省': '长春市红旗街1480号长影阳光景都3栋3门906',
        '辽宁省': '沈阳市和平区中华路88-1号百利保商务公寓910室-202',
        '河北省': '石家庄市广安大街15号天滋官鲤2号楼1单元501室',
        '内蒙古': '包头市青山区富强路7号49栋50号<br>呼和浩特市南茶房丽景天下A1高层2-202',
        '山西省': '太原市寇庄西路49号电子商务楼306室<br>太原市迎泽区朝阳街御都新天地14层15号',
        '天津市': '河东区十一经路三联大厦801室',
        '北京市': '海淀区西三环北路50号豪柏大厦C2座1505室',
        '山东省': '即墨市文化路638号1-1-501户（青岛倍速得信息技术有限公司）<br>济南市天桥区济洛路61号洛安广场5010室<br>济宁市仙营数码大厦一楼<br>聊城鲁西科技广场北步行街（聊城金诺电脑科技有限公司）<br>青岛市市南区中山路44-60号百盛大厦3019室',
        '江苏省': '常熟市东南开发区金都路8号常熟大学科技园东南谷研发4号楼2楼<br>常州晋陵路8号嘉宏盛世广场10号楼1419室<br>常州市天宁区晋陵北路1号 新天地商业广场A座5楼<br>连云港市新浦区苍梧路6号龙河大厦A座8楼<br>南京市中山北路105号中环国际广场1613室<br>南通市崇川区工农路111号华辰大厦B-302<br>常州市人民路3188号万达广场C座1502室<br>无锡市山水新城科教产业园锦溪路100号3号楼203室<br>徐州市青年路226号皇城大厦GB2-9-203<br>苏州市平江区人民路3158号万融国际1006室',
        '安徽省': '阜阳市人民中路79号康奈专卖店<br>合肥市站前路白马二期写字楼A座1906室',
        '浙江省': '海宁市海洲街道西山路612号1509室<br>杭州市下城区石祥路新天地尚座东路311室<br>湖州市织里镇阿祥路777号办公楼2楼<br>嘉兴市南湖区中山东路666号旭辉广场3号楼2113室<br>宁波市海曙区东渡路29号世贸中心18A16室<br>宁波市海曙区华楼巷19号天一豪景A座707室<br>桐乡市振兴中路56号物资大楼5楼<br>温州市鹿城区车站大道2号华盟商务广场3303<br>义乌市稠州北路699号金茂大厦2101室',
        '江西省': '南昌市西湖区洪城路778号星河国际大厦1523-1524',
        '福建省': '福州市六一中路永升城2幢29楼D室<br>泉州市田安南路671号千亿大厦10C室<br>厦门市思明区观音山宜兰路9号康利金融大厦903室',
        '广西省': '福桂林市清风小区春江苑D24-101<br>柳州市飞鹅二路1号谷埠街国际商贸城K2栋1230号<br>南宁市青秀区民族大道16号环球时代1316室',
        '广东省': '东莞市虎门镇虎门大道柏景豪庭添意阁19D<br>广州市天河北路广州软件信息广场890号407室<br>汕头市潮南区峡山镇金苑商贸区7-53号<br>深圳市福田区梅林街道卓越梅林中心广场二期A座1403<br>中山市石岐区安栏路92号永胜广场添丽苑20楼K座',
        '云南省': '昆明市云纺东南亚商城A座2104室',
        '湖北省': '武汉市台北一路2号天下国际4单元13A02室<br>武汉市光谷金融港B27栋11层<br>襄阳市樊城区大庆西路新颐高数码广场B栋1103',
        '湖南省': '长沙市人民路568号融圣国际2栋3101室<br>株洲市新华书店天顺楼2302室',
        '河南省': '洛阳市南昌路龙福小区B区二十四号楼一单元一楼101<br>濮阳市振兴路与胜利路交叉口北100米路西<br>郑州市东大街205号长江广场A座713室',
        '贵州省': '贵阳市中山南路花果园金融街<br>2号楼11楼22号',
        '海南省': '海口市滨海大道125号<br>金章华府（0898酒店）1603室',
        '重庆': '重庆市渝中区民权路88号<br>日月光广场R1栋3105室',
        '四川省': '成都市高新区天仁路387号大鼎世纪广场3号楼1802号',
        '新疆': '乌鲁木齐市中山路141号<br>百花村国际信息大厦A座2006室',
        '甘肃': '兰州市东岗东路2698号昌隆大厦630室',
        '陕西省': '西安市环城东路东屿枫舍52705室',
    };
    $('.map_show i').hover(function () {
        $(this).addClass('current').siblings().removeClass('current');
        var city = $(this).attr('data-city');
        $('.map_right').find('h3').html(city + '：').next().html(map_data[city]);
    }, function () {
        // $(this).removeClass('current');
    });

    // ishop在线商城更多功能动画
    $('.custom_show.style14 .list1 li').hover(function () {
        $(this).addClass('on').parent().addClass('on');
        $(this).siblings().removeClass('on');
    }, function () {
        $(this).removeClass('on').parent().removeClass('on');
    });

    $('.custom_show.style14 .list2 li').hover(function () {
        $(this).addClass('on').parent().addClass('on');
        $(this).siblings().removeClass('on');
    }, function () {
        $(this).removeClass('on').parent().removeClass('on');
    });


    // 关于百胜js
    $('.tag_ctl').click(function () {
        tag_change($(this).index(), $(this).attr('path'));
    });

    function tag_change(n, s) {
        if (s != location.href.split('#')[1] && s) {
            var index = n + 1;
            $('.tags').removeClass('show');
            $('.tag_' + index).addClass('show');
            $('.tag_ctl').removeClass('current').eq(n).addClass('current');
            var his = location.href.split('#')[0] + '#' + s;
            // console.log(his);
            window.history.pushState({}, 0, his);
        }
    }

    function path_act() {
        var url = location.href.split('#')[1] || $('.tag_ctl').eq(0).attr('path');
        $('[path=' + url + ']').addClass('current').siblings().removeClass('current');
        var index = $('[path=' + url + ']').index() + 1;
        $('.tags').removeClass('show');
        $('.tag_' + index).addClass('show');
    };
    window.addEventListener("popstate", function () {
        path_act();
    });

    // 应聘js
    $('.custom_show.style7').on('click', '.item_title', function () {
        if ($(this).parent().hasClass('show')) {
            $(this).parent().removeClass('show');
        } else {
            $('.item_title').parent().removeClass('show');
            $(this).parent().addClass('show');
        }
    });


    // 返回顶部js
    $('.float_toTop').on('click', function () {
        $("html,body").animate({scrollTop: 0}, 500);
    });

    $(document).bind('scroll', function () {
        var pageYOffset = window.pageYOffset;
        var innerHeight = window.innerHeight;
        if (pageYOffset >= innerHeight && !$('.float_toTop').hasClass('show')) {
            $('.float_toTop').fadeIn(400).addClass('show');
        } else if (pageYOffset < innerHeight) {
            $('.float_toTop').fadeOut(400).removeClass('show');
        }
    });

    // 在线客服
    $('.s_online').click(function () {
        $(this).addClass('close');
        $('.l_online').addClass('show');
    });
    $('.l_online .close').click(function () {
        $(this).parent().removeClass('show');
        $('.s_online').removeClass('close');
    });
    // 免费通话
    $('.free_btn').click(function () {
        $(this).addClass('close');
        $('.free_form').addClass('show');
    });
    $('.free_form .close').click(function () {
        $(this).parent().removeClass('show');
        $('.free_btn').removeClass('close');
    });


    // 首页顶部浮动图片关闭
    $('.top_float_close').click(function () {
        $('.top_float').fadeOut();
    });

    $('.job_filter li').click(function () {
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $(this).parents('.custom_show').find('.tab-content:eq(' + index + ')').show().siblings('.tab-content').hide();
        $(this).parents('.custom_show').find('.tab-content:eq(' + index + ') .list_item:first()').addClass('show');
    });
    var timer = null;
    $('#freeCall').on('submit', function () {
        var val = $(this).find('#phone').val();
        var regEx = new RegExp(/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/);
        if ('' === val) {
            $('.free_form .tips').text('请填写手机号码').removeClass('white');
            setTimeout(function () {
                $('#freeCall #phone').focus();
            }, 100);
            clearTimeout(timer);
            timer = setTimeout(function () {
                $('.free_form .tips').text('');
            }, 2000);
            return false;
        }
        if (!regEx.test(val)) {
            $('.free_form .tips').text('输入的手机号码有误，请重新填写！').removeClass('white');
            setTimeout(function () {
                $('#freeCall #phone').focus();
            }, 100);
            return false;
        }
        var url = window.location.href.split('/').pop() || '首页';
        $.ajax({
            type: 'post',
            cache: false,
            dataType: 'json',
            url: '/index.php?m=formguide&c=index&a=submit&formid=13&siteid=1',
            data: {info: {phone: val, url: url}},
            beforeSubmit: function () {
                // alert("我在提交表单之前被调用！");
            },
            success: function (data) {
                if (typeof(data) == "string")
                    data = eval('(' + data + ')');
                $('.free_form .tips').text(data.Message).addClass('white');

            }
        });

        function handle(data) {
            if (data.Status)
                ShowTip(data);
        }

        return false;
    });
});

/**
 * 公共消息提示框
 * @param {type} data
 * @returns {undefined}
 */
function ShowTip(data) {
    $('.tips_box').remove();
    var status = '';
    switch (data.Status) {
        case 0:
            status = 'error';
            break;
        case 1:
            status = 'success';
            break;
        case 2:
            status = 'loading';
            break;
        default:
            status = 'info';
    }
    var html = '<div class="tips_' + status + '_box tips_box" style="z-index:2000;"><div class="pull-left icon">' + (2 != data.Status ? '' : '<div class="loading_center"><div></div><div></div></div>') + '</div><div class="left message">' + data.Message + '</div></div>';
    $('body').append(html);
    $('.tips_box').css('margin-left', -($('.tips_box').width() / 2) + 'px');
    if (2 != data.status)
        setTimeout(function () {
            $('.tips_box').remove();
        }, 3000);
}


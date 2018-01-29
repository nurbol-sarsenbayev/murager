$(function() {

    var $wnd = $(window);
    var $top = $(".page-top");
    var $html = $("html, body");
    var $header = $(".section-header");
    var $menu = $(".main-menu");
    var $loader = $(".preloader");
    var $thanks = $("#thanks");

    $wnd.on('load', function() {        
        $loader.fadeOut('slow');            
    });

    $wnd.scroll(function() { onscroll(); });

    var menuTop = $menu.offset().top;

    var onscroll = function() {

        if($wnd.scrollTop() > $wnd.height()) {
            $top.addClass('active');
        } else {
            $top.removeClass('active');
        }

        var scrollPos = $wnd.scrollTop() + 149;

        $menu.find("a").each(function() {
            var link = $(this);
            var id = link.attr('href');
            var section = $(id);
            var sectionTop = section.offset().top;

            if(sectionTop <= scrollPos && (sectionTop + section.height()) >= scrollPos) {
                link.addClass('active');
            } else {
                link.removeClass('active');
            }
        });
    }

    onscroll();

    $top.click(function() {
        $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
    });

    $(".hamburger").click(function() {
        $this = $(this);

        if(!$this.hasClass("is-active")) {
            $this.addClass('is-active');
            $menu.slideDown('700');
        } else {
            $this.removeClass('is-active');
            $menu.slideUp('700');
        }

        return false;
    });  

    $(".main-menu a").click(function(e) {
        e.preventDefault();
        var $href = $(this).attr('href');
        if($href.length > 0) {
            var dh = $wnd.outerWidth() < 992 ? 114 : 149;
            var top = $href.length == 1 ? 0 : $($href).offset().top - dh;
            $html.stop().animate({ scrollTop: top }, "slow", "swing");
        }
    });

    $(".modal-open").click(function() {
        var id = $(this).data('id');
        $('#'+id).fadeIn(500);
        return false;
    });

    $(".modal").click(function() {
        var $modal = $(this);
        closeModal($modal);
    });

    $(".modal-content").click(function(e) {
        e.stopPropagation();
    });

    $(".modal-close").click(function() {
        var $modal = $(this).closest('.modal');
        closeModal($modal);
    });

    function closeModal($modal) {
        $modal.fadeOut(500);

        var $form = $modal.find('form');
        if($form.length > 0) $form[0].reset();

        var $phone = $form.find('.phone');
        if($phone.length > 0) $phone.removeClass('error');
    }

    $(".form-submit").click(function(e) {
        e.preventDefault();
        
        var $form = $(this).closest('form');
        var $phone = $form.find('.phone');

        if($phone.length && !$phone.val()) {
            $phone.addClass('error');
        } else {
            $.ajax({
                type: "POST",
                url: "/mail.php",
                data: $form.serialize()
            }).done(function() {                
            });

            $(this).closest('.modal').fadeOut(500);
            $phone.removeClass('error');
            $form[0].reset();
            $thanks.fadeIn(500);
        }
    });

    $(".phone").mask("+7 (999) 999 99 99", {
        completed: function() {
            $(this).removeClass('error');
        }
    });    

    $(".carousel-video-call").owlCarousel({
        nav: true,
        dots: true,
        loop: true,
        smartSpeed: 500,
        margin: 30,
        navText: ['', ''],
        responsive: {
            0: { items: 1 },
            768: { items: 2 },        
            992: { items: 3 },
        },
    });

});
    
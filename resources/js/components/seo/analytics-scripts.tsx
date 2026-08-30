import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export function AnalyticsScripts() {
    const { seoSettings } = usePage().props as unknown as { seoSettings?: any };
    const analytics = seoSettings?.analytics ?? {};
    const monetization = seoSettings?.monetization ?? {};

    useEffect(() => {
        if (typeof document === 'undefined') return;

        // Google Analytics 4
        if (analytics.google_analytics_id && !document.querySelector(`script[src*="${analytics.google_analytics_id}"]`)) {
            const gaId = analytics.google_analytics_id;
            const s1 = document.createElement('script');
            s1.async = true;
            s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(s1);
            const s2 = document.createElement('script');
            s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${gaId}');`;
            document.head.appendChild(s2);
        }

        // Google Tag Manager
        if (analytics.google_tag_manager_id && !document.querySelector(`script[src*="${analytics.google_tag_manager_id}"]`)) {
            const gtmId = analytics.google_tag_manager_id;
            const s = document.createElement('script');
            s.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
            document.head.appendChild(s);
            if (!document.getElementById('gtm-noscript')) {
                const noscript = document.createElement('noscript');
                noscript.id = 'gtm-noscript';
                noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
                document.body.insertAdjacentElement('afterbegin', noscript);
            }
        }

        // Bing Clarity
        if (analytics.bing_clarity_id && !document.querySelector(`script[data-clarity="${analytics.bing_clarity_id}"]`)) {
            const id = analytics.bing_clarity_id;
            const s = document.createElement('script');
            s.setAttribute('data-clarity', id);
            s.text = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${id}");`;
            document.head.appendChild(s);
        }

        // Facebook Pixel
        if (analytics.facebook_pixel_id && !document.querySelector(`script[data-fbpixel="${analytics.facebook_pixel_id}"]`)) {
            const id = analytics.facebook_pixel_id;
            const s = document.createElement('script');
            s.setAttribute('data-fbpixel', id);
            s.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${id}');fbq('track', 'PageView');`;
            document.head.appendChild(s);
        }

        // Plausible
        if (analytics.plausible_domain && !document.querySelector(`script[data-domain="${analytics.plausible_domain}"]`)) {
            const s = document.createElement('script');
            s.defer = true;
            s.setAttribute('data-domain', analytics.plausible_domain);
            s.src = analytics.plausible_script || 'https://plausible.io/js/script.js';
            document.head.appendChild(s);
        }

        // Umami
        if (analytics.umami_website_id && analytics.umami_script_url && !document.querySelector(`script[data-website-id="${analytics.umami_website_id}"]`)) {
            const s = document.createElement('script');
            s.defer = true;
            s.src = analytics.umami_script_url;
            s.setAttribute('data-website-id', analytics.umami_website_id);
            document.head.appendChild(s);
        }

        // Hotjar
        if (analytics.hotjar_id && !document.querySelector(`script[data-hotjar="${analytics.hotjar_id}"]`)) {
            const id = analytics.hotjar_id;
            const s = document.createElement('script');
            s.setAttribute('data-hotjar', id);
            s.text = `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${id},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
            document.head.appendChild(s);
        }

        // Custom head/body codes via innerHTML injection (once)
        const injectOnce = (id: string, code: string, target: HTMLElement) => {
            if (!code?.trim() || document.getElementById(id)) return;
            const wrapper = document.createElement('div');
            wrapper.id = id;
            wrapper.innerHTML = code;
            // move children and execute scripts
            Array.from(wrapper.children).forEach((child) => target.appendChild(child));
            wrapper.querySelectorAll('script').forEach((oldScript) => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
                newScript.textContent = oldScript.textContent;
                document.head.appendChild(newScript);
                oldScript.remove();
            });
            if (wrapper.innerHTML.trim() && wrapper.children.length === 0) {
                target.appendChild(wrapper);
            }
        };

        if (analytics.custom_head_code) injectOnce('custom-head-code', analytics.custom_head_code, document.head);
        if (analytics.custom_body_start_code) injectOnce('custom-body-start', analytics.custom_body_start_code, document.body);
        if (analytics.custom_body_end_code) injectOnce('custom-body-end', analytics.custom_body_end_code, document.body);

        // Monetization head/body custom
        if (monetization.custom_monetization_head) injectOnce('custom-monetization-head', monetization.custom_monetization_head, document.head);
        if (monetization.custom_monetization_body) injectOnce('custom-monetization-body', monetization.custom_monetization_body, document.body);

        // AdSense auto script is handled via blade + monetizationHead, but ensure push
        if (monetization.adsense_enabled && monetization.adsense_publisher_id) {
            if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
                const pub = monetization.adsense_publisher_id.startsWith('ca-pub-') ? monetization.adsense_publisher_id : `ca-pub-${monetization.adsense_publisher_id}`;
                const s = document.createElement('script');
                s.async = true;
                s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pub}`;
                s.crossOrigin = 'anonymous';
                document.head.appendChild(s);
            }
        }
    }, [analytics, monetization]);

    return null;
}

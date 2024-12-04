<?php

namespace App\Providers;

use Whitecube\LaravelCookieConsent\Consent;
use Whitecube\LaravelCookieConsent\CookiesServiceProvider as ServiceProvider;
use Whitecube\LaravelCookieConsent\Facades\Cookies;

class CookiesServiceProvider extends ServiceProvider
{
    /**
     * Define the cookies users should be aware of.
     */
    protected function registerCookies(): void
    {
        // Register Laravel's base cookies under the "required" cookies section:
        Cookies::essentials()
            ->session()
            ->csrf();

        // Register all Analytics cookies at once using one single shorthand method:
        // Cookies::analytics()
        //    ->google(
        //        id:          env('GOOGLE_ANALYTICS_ID'),
        //        anonymizeIp: env('GOOGLE_ANALYTICS_ANONYMIZE_IP'),
        //    );

        // Register custom cookies under the pre-existing "optional" category:
        Cookies::analytics()
            ->name('fullres_analytics')
            ->description('This cookie helps to give us a feedback about the website usage.')
            ->duration(365*24*60)
            ->accepted(function(Consent $consent) {
                $consent->script(view('layouts.fullres')->render());
            });
    }
}

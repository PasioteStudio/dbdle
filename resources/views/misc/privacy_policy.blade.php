<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    @vite(["resources/css/app.css","resources/sass/app.scss","resources/js/app.js"])
    <title>Privacy Policy</title>
</head>
<body>
<div class="row justify-content-center">
    <div class="col-sm-12 col-md-4">
        <h1>DBDle -- Privacy Policy</h1>
        <h2>Content Used From</h2>
        <p>
            This website uses materials (including images and perk descriptions) from most of the articles on the
            <a href="https://deadbydaylight.fandom.com/wiki/Dead_by_Daylight_Wiki">Dead by Daylight wiki</a>
             at
            <a href="https://www.fandom.com/">Fandom</a> and is licensed under the
            <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-NC-SA (Attribution-NonCommercial-ShareAlike) License</a>.
        </p>
        <h2>Bug and Security Reports</h2>
        <p>
            If you find any security vulnerabilities or bugs please contact us at <a href="mailto:{{ config("mail.from.address") }}">{{ config("mail.from.address") }}</a>
        </p>
        <h1>Cookie Policy</h1>

        <h2>How do we use cookies?</h2>

        @foreach(Cookies::getCategories() as $category)
            <h3 class="fw-bold">{{ $category->title }}</h3>
            <table>
                <thead>
                <tr>
                    <th>@lang('cookieConsent::cookies.cookie')</th>
                    <th>@lang('cookieConsent::cookies.purpose')</th>
                    <th>@lang('cookieConsent::cookies.duration')</th>
                </tr>
                </thead>
                <tbody>
                @foreach($category->getCookies() as $cookie)
                    <tr>
                        <td>{{ $cookie->name }}</td>
                        <td>{{ $cookie->description }}</td>
                        <td>{{ \Carbon\CarbonInterval::minutes($cookie->duration)->cascade() }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        @endforeach
        <div class="d-flex">
        <p class="my-auto">Users can opt out of cookies by clicking here -></p>
            @cookieconsentbutton('reset')
        </div>

        <!--<h2>Common ID Cookie</h2>
        <p>This site uses cookies and similar tracking technologies such as the Common ID cookie to provide its services.
            Cookies are important devices for measuring advertising effectiveness and ensuring a robust online advertising industry.
            The Common ID cookie stores a unique user id in the first party domain and is accessible to our ad partners.
            This simple ID that can be utilized to improve user matching, especially for delivering ads to iOS and MacOS browsers.
            Users can opt out of the Common ID tracking cookie by clicking <a href="">here</a>.</p>
        <h2>Advertising Privacy Settings</h2>
        <p>FOR EU USERS ONLY: When you use our site,
            pre-selected companies may access and use certain information on your device and about your interests to serve ads or personalized content.
            You may revisit or change consent-choices at any time by clicking <a href="">here</a>.</p>-->
        <br>
        <p>Thanks for playing DBDle! Go back to playing right <a href="/">here</a>.</p>
    </div>
</div>
</body>
</html>

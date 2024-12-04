<?php

return [

    /*
    |--------------------------------------------------------------------------
    | All Perks
    |--------------------------------------------------------------------------
    |
    |
    |
    |
    |
    |
    |
    */

    'perks' => [
    ],
    'fields'=>[
        "Perk"=>["Guess the random perk by icon",
            "perk",
            "https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/74/IconHelp_perks.png",
            "
            In perk mode, try to guess which perk has the image in the least number of tries.  <!-- or any random skin-->.
            <br>
            You can see its description once you found it!
            <br><br>
            GL. HF
            "

        ],
        "Quote"=>["Guess the character by a quote of their",
            "quote",
            "https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/7/72/IconHelp_archivesCollection.png",
            "
            In quote mode, try to guess which character says that quote in the least number of tries. The quote is always in a perk description!<!-- or any random skin-->.
            <br><br>
            GL. HF
            "
        ],
        "Killer"=>["Guess the killer by clues on every try",
            "killer",
            "https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/0/06/IconHelpLoading_killer.png",
            "
            In killer mode, try to guess which character is it in the least number of tries and it will reveal its properties..<!-- or any random skin-->.
            <br>
            The color of the tiles will change to show how close your guess was to the champion to find.
            <br>
            <span class='text-success'>Green</span> indicates the property is an exact match.
            <br>
            <span class='text-warning'>Orange</span> indicates partial match.
            <br>
            <span class='text-danger'>Red</span> indicates there is no overlap between your guess and the property.
            <br>
            ⬇️ ⬆️ With arrows, it also indicates if the answer property is above or below your guess.
            <br>
            <h1>Properties</h1>
            <p>Here is the details of each of the properties columns:</p>
            <h2>Gender:</h2>
            <p>Possible values: </p>
            <h2>Origin:</h2>
            <p>Where the character comes from</p>
            <p>Possible values:</p>
            <h2>Height</h2>
            <p>Possible values: Tall, Avarage, Short</p>
            <h2>Movement Speed</h2>
            <p>The resource used by the champion in game.</p>
            <p>Possible values: 4/6ms, etc...</p>
            <h2>Power attack type:</h2>
            <p></p>
            <p>Possible values: Special Attack, None or Basic Attack</p>
            <h2>Release date:</h2>
            <p>When the character was released to be played.</p>
            <p>Possible values: Any year between 2016 and today</p>
            <br><br>
            GL. HF
            "
        ],
        "Survivor"=>["Guess the survivor by clues on every try",
            "survivor",
            "https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/b/b3/IconHelpLoading_survivor.png"
        ],
        "Terror Radius"=>["Guess the killer by their terror radius",
            "terror_radius",
            "https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/5/5b/IconHelp_skills.png"
        ],
        "Splash"=>["Guess the character by a splash of their",
            "splash",
            "https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/6/69/OutfitIcon.png",
            "
            In splash mode, try to guess which character has the whole splash art as a skin image in the least number of tries. It can be cut from the original one <!-- or any random skin-->.
            <br>
            You can see it full once you guessed it correctly!
            <br><br>
            GL. HF
            "
        ]
    ]
];

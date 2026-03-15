import ImageResponse from "@takumi-rs/image-response";
import React from "react";

export function GET(request: Request) {


    return new ImageResponse(
        (<div
            tw="w-full h-full bg-size-[100px_100px] px-8 pt-8 bg-transparent"
        >
            <h1 tw="flex font-semibold text-[#FAF8F6] text-6xl block whitespace-pre my-0">
                PvM <span tw="text-[#E0C090]">Leaderboard </span> 🏅
            </h1>
            {
                mappackRanks.sort((a, b) => {
                    if (a.pointsNeeded > b.pointsNeeded) {
                        return -1;
                    } else if (a.pointsNeeded < b.pointsNeeded) {
                        return 1;
                    }
                    return 0;
                }).filter((rank, r_index) => {
                    let prev_rank = mappackRanks[r_index - 1];
                    if (prev_rank === undefined) {
                        prev_rank = mappackRanks[0]
                    }
                    return players.filter((f) => f.total_points >= rank.pointsNeeded && f.total_points < prev_rank.pointsNeeded).length !== 0
                }).map((rank, r_index) => (

                    <div tw="justify-start items-start grid grid-cols-2 text-white">
                        <span tw={"pt-6 col-span-2 text-4xl font-[Geist_Mono] font-bold text-[" + rank.color + "]"}>
                            {rank.name} - {rank.pointsNeeded}pts
                        </span>
                        {
                            players.map((player, index) => {
                                let prev_rank = mappackRanks[r_index];
                                if (prev_rank === undefined) {
                                    prev_rank = mappackRanks[0]
                                }
                                if (player.total_points >= rank.pointsNeeded && player.total_points <= prev_rank.pointsNeeded) {

                                } else {
                                    return;
                                }

                                return (<span tw="px-2  items-end">
                                    <span tw="align-baseline font-[Geist_Mono] r-3 ">#{(index + 1).toLocaleString('en-US', {
                                        minimumIntegerDigits: 2,
                                        useGrouping: false
                                    })}</span>
                                    <span tw="pl-1 align-baseline text-[#E0C090] text-2xl font-bold ">
                                        {player.player.name}
                                    </span>
                                    <span tw={"font-[Geist_Mono] align-baseline pl-1  text-[" + rank.color + "]"}>
                                        {player.total_points}
                                    </span>

                                </span>)
                            })}

                    </div>
                ))}

            < div tw="flex w-full justify-center items-center text-[#FAF8F6]" >
                <p tw="  whitespace-pre mt-4">
                    <span tw="text-[#E0C090]">dirtin' </span>
                </p>
                <p tw="text-sm">
                    - ⚡ by pvms.club
                </p>
            </div>
        </div>)
        ,
        {
            format: "png",
            devicePixelRatio: 1.0
        },
    );
}


const players = [
    {
        "player_id": "8b23a52e-a6fb-4cc9-a53b-0c46c08768fa",
        "mappack_id": "dirt_pvm",
        "total_points": 1815,
        "achievements_count": 67,
        "best_achievements_count": 24,
        "last_updated": "2026-03-15T03:47:52.435221Z",
        "player": {
            "ID": "8b23a52e-a6fb-4cc9-a53b-0c46c08768fa",
            "name": "Sqlc.",
            "Records": null
        }
    },
    {
        "player_id": "3f9c1ad1-98f8-4c69-86d8-0c93ea18b9c2",
        "mappack_id": "dirt_pvm",
        "total_points": 1250,
        "achievements_count": 53,
        "best_achievements_count": 23,
        "last_updated": "2026-03-15T03:26:04.875097Z",
        "player": {
            "ID": "3f9c1ad1-98f8-4c69-86d8-0c93ea18b9c2",
            "name": "SparkTheYoofer",
            "Records": null
        }
    },
    {
        "player_id": "fb678553-f730-442a-a035-dfc50f4a5b7b",
        "mappack_id": "dirt_pvm",
        "total_points": 1125,
        "achievements_count": 49,
        "best_achievements_count": 17,
        "last_updated": "2026-03-15T03:31:30.341551Z",
        "player": {
            "ID": "fb678553-f730-442a-a035-dfc50f4a5b7b",
            "name": "mime-",
            "Records": null
        }
    },
    {
        "player_id": "8c14f490-b9b5-44b3-ab01-a3c4937f3000",
        "mappack_id": "dirt_pvm",
        "total_points": 1115,
        "achievements_count": 47,
        "best_achievements_count": 24,
        "last_updated": "2026-03-14T15:44:02.661578Z",
        "player": {
            "ID": "8c14f490-b9b5-44b3-ab01-a3c4937f3000",
            "name": "miles.TM",
            "Records": null
        }
    },
    {
        "player_id": "6f67d602-f64b-4bed-a608-347adcf8cad1",
        "mappack_id": "dirt_pvm",
        "total_points": 1020,
        "achievements_count": 38,
        "best_achievements_count": 14,
        "last_updated": "2026-03-14T15:24:12.736041Z",
        "player": {
            "ID": "6f67d602-f64b-4bed-a608-347adcf8cad1",
            "name": "Novu.",
            "Records": null
        }
    },
    {
        "player_id": "45bcd4c6-7261-4dbb-b83f-ff8292083d02",
        "mappack_id": "dirt_pvm",
        "total_points": 755,
        "achievements_count": 25,
        "best_achievements_count": 11,
        "last_updated": "2026-03-13T20:08:34.055122Z",
        "player": {
            "ID": "45bcd4c6-7261-4dbb-b83f-ff8292083d02",
            "name": "Flueffel.",
            "Records": null
        }
    },
    {
        "player_id": "83f1b42b-1711-4d89-b767-94a49afd3b0e",
        "mappack_id": "dirt_pvm",
        "total_points": 745,
        "achievements_count": 41,
        "best_achievements_count": 17,
        "last_updated": "2026-03-14T03:06:22.908715Z",
        "player": {
            "ID": "83f1b42b-1711-4d89-b767-94a49afd3b0e",
            "name": "z7on",
            "Records": null
        }
    },
    {
        "player_id": "e54cee6f-e52a-4cb4-bfa3-cb19017a2015",
        "mappack_id": "dirt_pvm",
        "total_points": 735,
        "achievements_count": 30,
        "best_achievements_count": 12,
        "last_updated": "2026-03-13T20:08:30.043145Z",
        "player": {
            "ID": "e54cee6f-e52a-4cb4-bfa3-cb19017a2015",
            "name": "JaffaPadawan",
            "Records": null
        }
    },
    {
        "player_id": "b09527f2-b61d-4d9a-8cdc-73484590f81f",
        "mappack_id": "dirt_pvm",
        "total_points": 710,
        "achievements_count": 25,
        "best_achievements_count": 10,
        "last_updated": "2026-03-13T20:08:34.374704Z",
        "player": {
            "ID": "b09527f2-b61d-4d9a-8cdc-73484590f81f",
            "name": "Insanity.TM",
            "Records": null
        }
    },
    {
        "player_id": "bf5f13a3-3be5-457b-88fa-2b4fee777fd6",
        "mappack_id": "dirt_pvm",
        "total_points": 660,
        "achievements_count": 26,
        "best_achievements_count": 10,
        "last_updated": "2026-03-15T15:17:36.301992Z",
        "player": {
            "ID": "bf5f13a3-3be5-457b-88fa-2b4fee777fd6",
            "name": "vrinho.",
            "Records": null
        }
    },
    {
        "player_id": "56e58f7f-8e7e-4206-a4ef-45f0fb6e1d60",
        "mappack_id": "dirt_pvm",
        "total_points": 655,
        "achievements_count": 25,
        "best_achievements_count": 10,
        "last_updated": "2026-03-15T15:38:15.899158Z",
        "player": {
            "ID": "56e58f7f-8e7e-4206-a4ef-45f0fb6e1d60",
            "name": "SaboJr..",
            "Records": null
        }
    },
    {
        "player_id": "0bd32607-2b58-4a9f-b213-0037322510c1",
        "mappack_id": "dirt_pvm",
        "total_points": 645,
        "achievements_count": 21,
        "best_achievements_count": 9,
        "last_updated": "2026-03-13T20:08:34.821121Z",
        "player": {
            "ID": "0bd32607-2b58-4a9f-b213-0037322510c1",
            "name": "Hendo22_",
            "Records": null
        }
    },
    {
        "player_id": "76ecd80b-33e0-4ac0-923c-ea2c05926eeb",
        "mappack_id": "dirt_pvm",
        "total_points": 585,
        "achievements_count": 26,
        "best_achievements_count": 16,
        "last_updated": "2026-03-15T15:40:35.128186Z",
        "player": {
            "ID": "76ecd80b-33e0-4ac0-923c-ea2c05926eeb",
            "name": "Liffey.",
            "Records": null
        }
    },
    {
        "player_id": "bfcbe019-bc7f-4ee2-a405-a6c0ca7ee7b1",
        "mappack_id": "dirt_pvm",
        "total_points": 575,
        "achievements_count": 34,
        "best_achievements_count": 14,
        "last_updated": "2026-03-15T03:26:04.882053Z",
        "player": {
            "ID": "bfcbe019-bc7f-4ee2-a405-a6c0ca7ee7b1",
            "name": "Marijntje04",
            "Records": null
        }
    },
    {
        "player_id": "23346f43-788f-48a5-b4f4-1efb085efcc7",
        "mappack_id": "dirt_pvm",
        "total_points": 575,
        "achievements_count": 27,
        "best_achievements_count": 12,
        "last_updated": "2026-03-15T15:25:19.832118Z",
        "player": {
            "ID": "23346f43-788f-48a5-b4f4-1efb085efcc7",
            "name": "EggyTM",
            "Records": null
        }
    },
    {
        "player_id": "c918a06c-c622-49e4-b66b-6bcb6488db4c",
        "mappack_id": "dirt_pvm",
        "total_points": 510,
        "achievements_count": 21,
        "best_achievements_count": 13,
        "last_updated": "2026-03-14T15:23:23.661814Z",
        "player": {
            "ID": "c918a06c-c622-49e4-b66b-6bcb6488db4c",
            "name": "InfernoTM.",
            "Records": null
        }
    },
    {
        "player_id": "2016f67a-0814-42ed-bea8-2e75da48840d",
        "mappack_id": "dirt_pvm",
        "total_points": 480,
        "achievements_count": 14,
        "best_achievements_count": 6,
        "last_updated": "2026-03-13T20:08:32.064612Z",
        "player": {
            "ID": "2016f67a-0814-42ed-bea8-2e75da48840d",
            "name": "Ikewolf",
            "Records": null
        }
    },
    {
        "player_id": "31e283e1-5e91-40c7-81cd-cd2f1d36ffb3",
        "mappack_id": "dirt_pvm",
        "total_points": 475,
        "achievements_count": 14,
        "best_achievements_count": 6,
        "last_updated": "2026-03-13T20:08:33.199124Z",
        "player": {
            "ID": "31e283e1-5e91-40c7-81cd-cd2f1d36ffb3",
            "name": "RotcatXBOX",
            "Records": null
        }
    },
    {
        "player_id": "d11bb874-d79b-43cd-93c1-8f02b0b5d636",
        "mappack_id": "dirt_pvm",
        "total_points": 465,
        "achievements_count": 11,
        "best_achievements_count": 5,
        "last_updated": "2026-03-13T20:08:33.142775Z",
        "player": {
            "ID": "d11bb874-d79b-43cd-93c1-8f02b0b5d636",
            "name": "propanoia",
            "Records": null
        }
    },
    {
        "player_id": "42b792dd-ec82-414d-a9e4-41f26c22207f",
        "mappack_id": "dirt_pvm",
        "total_points": 450,
        "achievements_count": 26,
        "best_achievements_count": 13,
        "last_updated": "2026-03-15T15:15:22.388164Z",
        "player": {
            "ID": "42b792dd-ec82-414d-a9e4-41f26c22207f",
            "name": "PebTM",
            "Records": null
        }
    }
]

const mappackRanks = [
    {
        "id": 46,
        "mappack_id": "dirt_pvm",
        "name": "Dirt Gamer",
        "pointsNeeded": 2250,
        "color": "#7c1b1b",
        "backgroundGlow": true,
        "invertedColor": false,
        "textShadow": false,
        "glowIntensity": 60,
        "borderWidth": 2,
        "borderColor": null,
        "symbolsAround": null,
        "animationType": "shine",
        "cardStyle": "metallic",
        "backgroundPattern": "grid",
        "fontSize": "normal",
        "fontWeight": "bold"
    },
    {
        "id": 43,
        "mappack_id": "dirt_pvm",
        "name": "Dirt Enjoyer",
        "pointsNeeded": 450,
        "color": "#00ff9c",
        "backgroundGlow": false,
        "invertedColor": false,
        "textShadow": false,
        "glowIntensity": 58,
        "borderWidth": 2,
        "borderColor": null,
        "symbolsAround": null,
        "animationType": "none",
        "cardStyle": "metallic",
        "backgroundPattern": "dots",
        "fontSize": "normal",
        "fontWeight": "normal"
    },
    {
        "id": 44,
        "mappack_id": "dirt_pvm",
        "name": "Dirt Enthusiast",
        "pointsNeeded": 900,
        "color": "#e3ff00",
        "backgroundGlow": true,
        "invertedColor": false,
        "textShadow": false,
        "glowIntensity": 70,
        "borderWidth": 2,
        "borderColor": null,
        "symbolsAround": null,
        "animationType": "none",
        "cardStyle": "metallic",
        "backgroundPattern": "grid",
        "fontSize": "normal",
        "fontWeight": "normal"
    },
    {
        "id": 41,
        "mappack_id": "dirt_pvm",
        "name": "Dirt Beginner",
        "pointsNeeded": 0,
        "color": "#ffffff",
        "backgroundGlow": false,
        "invertedColor": false,
        "textShadow": false,
        "glowIntensity": 50,
        "borderWidth": 2,
        "borderColor": null,
        "symbolsAround": null,
        "animationType": "none",
        "cardStyle": "normal",
        "backgroundPattern": "none",
        "fontSize": "normal",
        "fontWeight": "normal"
    },
    {
        "id": 45,
        "mappack_id": "dirt_pvm",
        "name": "Dirt Lover",
        "pointsNeeded": 1500,
        "color": "#ff7b00ff",
        "backgroundGlow": true,
        "invertedColor": false,
        "textShadow": false,
        "glowIntensity": 50,
        "borderWidth": 2,
        "borderColor": null,
        "symbolsAround": null,
        "animationType": "none",
        "cardStyle": "holographic",
        "backgroundPattern": "diagonal",
        "fontSize": "normal",
        "fontWeight": "normal"
    },
    {
        "id": 42,
        "mappack_id": "dirt_pvm",
        "name": "Dirt Casual",
        "pointsNeeded": 150,
        "color": "#00c6ff",
        "backgroundGlow": false,
        "invertedColor": false,
        "textShadow": false,
        "glowIntensity": 60,
        "borderWidth": 2,
        "borderColor": null,
        "symbolsAround": null,
        "animationType": "none",
        "cardStyle": "normal",
        "backgroundPattern": "dots",
        "fontSize": "normal",
        "fontWeight": "normal"
    }
]
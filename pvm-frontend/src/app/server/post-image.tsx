import { MappackRank, LeaderboardEntry } from "@/types/mappack.types";
import ImageResponse from "@takumi-rs/image-response";
import axios from "axios";
import React from "react";
import { FaMedal } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";

export const runtime = "edge";

let prev_players: LeaderboardEntry[] = []

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://pvms.club/api"; /* "http://localhost:8080" */
const mappackId = "dirt_pvm";
export async function postImage() {
    const leaderboardRes = await fetch(
        `${API_BASE}/mappacks/${mappackId}/leaderboard?limit=20&offset=0`,
    );
    const players: LeaderboardEntry[] = await leaderboardRes.json();

    // Wait one cycle if we just started to avoid additional logic
    if (prev_players.length === 0) {
        console.log("Skipping first job to populate prev_players cache.")
        prev_players = players;
        return;
    }

    // Skip rendering when there are no changes in the players ranking (point changes will get ignored).
    if (players.filter((player, index) => {
        player.player_id === prev_players[index].player_id
    }).length === 0) {
        console.log("Skipping rendering because nothing in the leaderboard changed.")
        return;
    }

    const mappackRes = await fetch(`${API_BASE}/mappacks/${mappackId}`);
    const mappack = await mappackRes.json();


    const mappackRanks: MappackRank[] = mappack.mappackRanks;
    const accentColor = mappack.accentColor;
    const organization = mappack.organization;
    const webhookUrl = process.env.WEBHOOK_URL;

    // Skip image generation if the mappack doesnt have a webhook associated.
    if (webhookUrl === "" || webhookUrl === null || webhookUrl === undefined) {
        console.log("Webhook not set");
        return;
    }

    let response = new ImageResponse(
        <div tw="w-full h-full bg-size-[100px_100px] px-8 pt-1 bg-transparent">
            <h1 tw="flex font-semibold text-[#FAF8F6] text-6xl block whitespace-pre my-0">
                {<FaMedal color={accentColor} size={45} />} PvM{" "}
                <span tw={"text-[" + accentColor + "]"}>Leaderboard </span>
            </h1>
            {mappackRanks
                .sort((a, b) => {
                    if (a.pointsNeeded > b.pointsNeeded) {
                        return -1;
                    } else if (a.pointsNeeded < b.pointsNeeded) {
                        return 1;
                    }
                    return 0;
                })
                .filter((rank, r_index) => {
                    let prev_rank = mappackRanks[r_index - 1];
                    if (prev_rank === undefined) {
                        return (
                            players.filter(
                                (f) =>
                                    f.total_points >= rank.pointsNeeded
                            ).length !== 0
                        );
                    }
                    return (
                        players.filter(
                            (f) =>
                                f.total_points >= rank.pointsNeeded &&
                                f.total_points <= prev_rank.pointsNeeded,
                        ).length !== 0
                    );
                })
                .map((rank, r_index) => (
                    <div tw="justify-start items-start grid grid-cols-2 text-white">
                        <span
                            tw={
                                "pt-6 col-span-2 text-4xl font-[Geist_Mono] font-bold text-[" +
                                rank.color +
                                "]"
                            }
                        >
                            {rank.name} - {rank.pointsNeeded}pts
                        </span>
                        {players.map((player, index) => {
                            let prev_mappack_rank = mappackRanks[r_index - 1];
                            if (prev_mappack_rank === undefined) {
                                if (player.total_points >= rank.pointsNeeded) {

                                } else {
                                    return
                                }
                            } else {
                                if (
                                    player.total_points >= rank.pointsNeeded &&
                                    player.total_points <= prev_mappack_rank.pointsNeeded
                                ) {
                                } else {
                                    return;
                                }

                            }

                            return (
                                <span tw="px-2 items-end">
                                    <span tw="align-baseline font-[Geist_Mono] r-3 ">
                                        #
                                        {(index + 1).toLocaleString("en-US", {
                                            minimumIntegerDigits: 2,
                                            useGrouping: false,
                                        })}
                                    </span>
                                    <span tw="text-transparent">d</span>{" "}
                                    {/* Intended way to add a margin to spans :thumbsup: */}
                                    <span
                                        tw={
                                            "pl-1 align-baseline text-3xl font-bold text-[" +
                                            accentColor +
                                            "]"
                                        }
                                    >
                                        {player.player.name}
                                    </span>
                                    <span tw="text-transparent">d</span>
                                    {/* Intended way to add a margin to spans :thumbsup: */}
                                    <span
                                        tw={
                                            "font-[Geist_Mono] align-baseline pl-1  text-[" +
                                            rank.color +
                                            "]"
                                        }
                                    >
                                        {player.total_points}
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                ))}
            <div tw="flex w-full justify-center mb-0 mt-4 pb-0 items-center text-[#FAF8F6]">
                <p tw="whitespace-pre">
                    <span tw={"text-[" + accentColor + "]"}>{organization} </span>
                </p>
                <p>- pvms.club</p>
            </div>
            <div tw="flex  justify-center p-0">
                <IoHeart color={accentColor} size={50} />
            </div>
        </div>,
        {
            format: "png",
            devicePixelRatio: 3.0,
        },
    );

    prev_players = players;


    let body = await response.bytes();

    const formData = new FormData();
    formData.append(
        "payload_json",
        JSON.stringify({
            embeds: [{ image: { url: "attachment://image.png" }, color: 14729360 }],
        }),
    );
    formData.append(
        "file1",
        new Blob([body], { type: "image/png" }),
        "image.png",
    );

    await fetch(webhookUrl, {
        method: "POST",
        body: formData,
    });

    console.log("Webhook posted");
}

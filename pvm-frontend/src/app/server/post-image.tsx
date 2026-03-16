import { MappackRank, PlayerLeaderboardEntry } from "@/types/mappack.types";
import ImageResponse from "@takumi-rs/image-response";
import axios from "axios";
import React from "react";
import { FaMedal } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pvms.club/api"; /* "http://localhost:8080" */
const mappackId = "dirt_pvm";
export async function postImage() {
  const leadearboard = await axios.get(
    `${API_BASE}/mappacks/${mappackId}/leaderboard?limit=${20}&offset=${0}`,
  );

  const players: PlayerLeaderboardEntry[] = leadearboard.data;

  const mappack = await axios.get(`${API_BASE}/mappacks/${mappackId}`);

  console.log(players);

  const mappackRanks: MappackRank[] = mappack.data.mappackRanks;

  const accentColor = mappack.data.accentColor;
  const organization = mappack.data.organization;
  const webhookUrl = process.env.WEBHOOK_URL;

  // Skip image generation if the mappack doesnt have a webhook associated.
  if (webhookUrl === "" || webhookUrl === null || webhookUrl === undefined) {
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
            prev_rank = mappackRanks[0];
          }
          return (
            players.filter(
              (f) =>
                f.total_points >= rank.pointsNeeded &&
                f.total_points < prev_rank.pointsNeeded,
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
              let prev_rank = mappackRanks[r_index];
              if (prev_rank === undefined) {
                prev_rank = mappackRanks[0];
              }
              if (
                player.total_points >= rank.pointsNeeded &&
                player.total_points <= prev_rank.pointsNeeded
              ) {
              } else {
                return;
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

  let body = await response.bytes();

  const form = new FormData();

  form.append(
    "payload_json",
    JSON.stringify({
      embeds: [
        {
          image: {
            url: "attachment://image.png",
          },
          color: 14729360,
        },
      ],
    }),
  );

  // Append the file
  form.append("file1", new Blob([body], { type: "image/png" }), "image.png");

  await axios.post(webhookUrl, form);
}

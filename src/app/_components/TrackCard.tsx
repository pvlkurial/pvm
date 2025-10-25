"use client";
import { Card, CardFooter, CardHeader, Image } from "@heroui/react"
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toTimeFromMilliseconds } from "../_utils/converters";

interface TrackTimeGoal {
    ID: string;
    time_goal_id: number;
    time: number;
}

interface TimeGoalDefinition {
    ID: number;
    name: string;
}

interface TrackCardProps {
    track: any;
    timeGoals: TrackTimeGoal[];
    timeGoalDefinitions: TimeGoalDefinition[];
    mappackId: string;
}

export default function TrackCard({ track, timeGoals, timeGoalDefinitions, mappackId }: TrackCardProps) {
    const router = useRouter();
    const getTimeGoalName = (id: number) => {
        return timeGoalDefinitions.find(def => def.ID === id)?.name || `Goal ${id}`;
    };

    return (
        <div>
            <Card className="h-50h group transition-transform hover:scale-105 duration-300 hover:z-20 transform-gpu"
                    shadow="sm" isPressable onPress={() => router.push(mappackId +'/'+ track.id)}>
                <CardHeader className="absolute z-10 top-1 flex-col items-start top-0 bg-black/30 justify-between">
                    <h4 className="text-white font-medium text-large">{track.name}</h4>
                    <p className="text-white/30 text-sm">{track.author}</p>
                </CardHeader>
                <Image
                    removeWrapper
                    alt="Card background"
                    className="z-0 w-full h-full object-cover"
                    src={track.thumbnailUrl}
                />
                <CardFooter className="absolute bg-black/30 bottom-0  border-black-100/50 z-10 justify-between
                            translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                    <div>
                        <ul className="flex gap-4 divide-x divide-white/20 list-none w-full justify-around items-center">
                            {timeGoals.map((timegoal) => (
                                <li key={timegoal.ID} className="flex flex-col items-center px-4 first:pl-0 items-center">
                                    <span className="text-white text-tiny font-semibold ">
                                        {getTimeGoalName(timegoal.time_goal_id)}
                                    </span>
                                    <span className="text-white/70 text-tiny">
                                        {toTimeFromMilliseconds(timegoal.time)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
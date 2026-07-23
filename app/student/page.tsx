"use client";

import { useState } from "react";
import ProfileManagement from "./ProfileManagement";
import SkillGapAnalyzer from "./SkillGapAnalyzer";

export default function StudentDashboard() {
    const [active, setActive] = useState("profile");

    return (
        <div>
            <div className="flex gap-4 p-4">
                <button
                    onClick={() => setActive("profile")}
                    className="px-4 py-2 border rounded"
                >
                    Profile Management
                </button>

                <button
                    onClick={() => setActive("skill")}
                    className="px-4 py-2 border rounded"
                >
                    Skill Gap Analyzer
                </button>
            </div>

            {active === "profile" ? (
                <ProfileManagement />
            ) : (
                <SkillGapAnalyzer />
            )}
        </div>
    );
}
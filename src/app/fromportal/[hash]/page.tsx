'use client'
import { UserContext } from "@/context/UserContext";
import { decryptId } from "@/utils/crypto-utils";
import { Skeleton } from "@mui/material";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";

export default function FromPortal() {
    const { hash } = useParams<{ hash: string }>()
    const { refreshUserWithId } = useContext(UserContext)
    const getUserId = useCallback(async () => {
        if (hash) {
            const url = await decryptId(hash)
            refreshUserWithId(url)
        }
    }, [refreshUserWithId, hash])

    useEffect(() => { getUserId() }, [getUserId])

    return <div style={{width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Skeleton animation={"wave"} sx={{width: '300px', height: "300px"}}/>
    </div>
}
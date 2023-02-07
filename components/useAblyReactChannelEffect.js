import Ably from "ably/promises"
import React from "react"

const ably = new Ably.Realtime.Promise({ authUrl: '/api/createTokenRequest' })

export const useAblyReactChannelEffect = (channelName, callbackOnMessage) => {

    const channel = ably.channels.get(channelName)

    const onMount = () => {
        channel.subscribe(msg => { callbackOnMessage(msg) })
    }

    const onUnMount = () => {
        channel.unsubscribe();
    }

    const useEffectHook = () => {
        onMount();
        return () => { onUnMount() }
    }

    React.useEffect(useEffectHook)

    return [channel, ably];
}
package com.kirinpatel.ablyHistory;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.gson.Gson;

import io.ably.lib.realtime.AblyRealtime;
import io.ably.lib.realtime.Channel;
import io.ably.lib.realtime.ChannelState;
import io.ably.lib.realtime.ChannelStateListener;
import io.ably.lib.types.AblyException;
import io.ably.lib.types.Message;
import io.ably.lib.types.PaginatedResult;
import io.ably.lib.types.Param;

public class AblyHistory extends ReactContextBaseJavaModule {

    public AblyHistory(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AblyHistory";
    }

    @ReactMethod
    public void get(String ablyKey, String channelId, final Callback errorCallback, final Callback successCallback) {
        try {
            AblyRealtime ably = new AblyRealtime(ablyKey);
            final Channel channel = ably.channels.get(channelId);
            channel.on(ChannelState.attached, new ChannelStateListener() {
                @Override
                public void onChannelStateChanged(ChannelStateChange stateChange) {
                    Param[] options = new Param[]{new Param("untilAttach", "true")};
                    try {
                        PaginatedResult<Message> resultPage = channel.history(options);
                        String messages = new Gson().toJson(resultPage.items());
                        successCallback.invoke(messages);
                    } catch (AblyException e) {
                        errorCallback.invoke(e.getMessage());
                    }
                }
            });
            channel.attach();
        } catch (AblyException e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}

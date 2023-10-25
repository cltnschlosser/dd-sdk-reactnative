/*
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache License Version 2.0.
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2016-Present Datadog, Inc.
 */

import Foundation

@objc
public class DdSessionReplayImplementation: NSObject {
    @objc
    public func enable(replaySampleRate: Double, defaultPrivacyLevel: String, resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
        resolve(nil)
    }
}

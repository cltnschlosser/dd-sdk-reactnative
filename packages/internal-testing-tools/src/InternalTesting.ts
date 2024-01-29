/*
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache License Version 2.0.
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2016-Present Datadog, Inc.
 */

import { Platform } from 'react-native';

import { buildLogsAssertions } from './assertions/logs';
import { buildTraceAssertions } from './assertions/trace';
import type { NativeInternalTestingType } from './nativeModulesTypes';
import { Report } from './report/Report';
import type { Feature, eventTypeByFeature } from './types/events';
import { base64 } from './utils/base64';

export class InternalTestingWrapper {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    private nativeInternalTesting: NativeInternalTestingType = require('./specs/NativeDdInternalTesting')
        .default;
    private report = new Report();

    /**
     * Enable internal testing.
     * Must be called before initializing the SDK.
     */
    enable = (): Promise<void> => {
        return this.nativeInternalTesting.enable();
    };

    /**
     * Clears all testing data collected.
     */
    clearData = () => {
        return this.nativeInternalTesting.clearData();
    };

    /**
     * Returns events for assertions.
     */
    getEvents = async () => {
        const logsEvents = await this.getAllEvents('logging');
        const traceEvents = await this.getAllEvents('tracing');

        return {
            logs: this.report.connectAssertionsToReport(
                buildLogsAssertions(logsEvents)
            ),
            trace: this.report.connectAssertionsToReport(
                buildTraceAssertions(traceEvents)
            )
        };
    };

    /**
     * Return all events.
     */
    getAllEvents = async <F extends Feature>(
        feature: F
    ): Promise<eventTypeByFeature[F][]> => {
        const events = await this.nativeInternalTesting.getAllEvents(
            formatFeatureName(feature)
        );

        // iOS JSON events are formatted as base64
        if (Platform.OS === 'ios') {
            return (JSON.parse(events) as string[]).map(event =>
                JSON.parse(base64.decode(event))
            );
        }

        return JSON.parse(events);
    };
}

export const InternalTesting = new InternalTestingWrapper();

const formatFeatureName = (feature: Feature): string => {
    // Logging feature is called "logs" on Android
    if (feature === 'logging' && Platform.OS === 'android') {
        return 'logs';
    }
    return feature;
};

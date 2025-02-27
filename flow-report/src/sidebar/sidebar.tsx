/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {classNames, useCurrentLhr, useFlowResult, useLocale} from '../util';
import {SidebarFlow} from './flow';

const Separator: FunctionComponent = () => {
  return <div className="Separator" role="separator"></div>;
};

export const SidebarSummary: FunctionComponent = () => {
  const currentLhr = useCurrentLhr();
  const url = new URL(location.href);
  url.hash = '#';
  return (
    <a
      href={url.href}
      className={classNames('SidebarSummary', {'Sidebar--current': currentLhr === null})}
      data-testid="SidebarSummary"
    >
      <div className="SidebarSummary__icon"></div>
      <div className="SidebarSummary__label">Summary</div>
    </a>
  );
};

const SidebarRuntimeSettings: FunctionComponent<{settings: LH.ConfigSettings}> = ({settings}) => {
  return (
    <details className="SidebarRuntimeSettings">
      <summary>
        {
          `${settings.screenEmulation.height}x${settings.screenEmulation.width}px | ` +
          `${settings.formFactor}`
        }
      </summary>
      <div>Emulated user agent: {settings.emulatedUserAgent}</div>
      <div>Channel: {settings.channel}</div>
    </details>
  );
};

export const SidebarHeader: FunctionComponent<{title: string, date: string}> = ({title, date}) => {
  const locale = useLocale();
  const formatter = useMemo(() => {
    const options:Intl.DateTimeFormatOptions = {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: 'numeric', timeZoneName: 'short',
    };
    return new Intl.DateTimeFormat(locale, options);
  }, [locale]);
  const dateString = useMemo(() => formatter.format(new Date(date)), [date, formatter]);
  return (
    <div className="SidebarHeader">
      <div className="SidebarHeader__title">{title}</div>
      <div className="SidebarHeader__date">{dateString}</div>
    </div>
  );
};

const SidebarSectionTitle: FunctionComponent = ({children}) => {
  return <div className="SidebarSectionTitle">{children}</div>;
};

export const Sidebar: FunctionComponent = () => {
  const flowResult = useFlowResult();
  const firstLhr = flowResult.lhrs[0];
  return (
    <div className="Sidebar">
      <SidebarHeader title="Lighthouse User Flow Report" date={firstLhr.fetchTime}/>
      <SidebarSectionTitle>RUNTIME SETTINGS</SidebarSectionTitle>
      <Separator/>
      <SidebarRuntimeSettings settings={firstLhr.configSettings}/>
      <Separator/>
      <SidebarSectionTitle>USER FLOW</SidebarSectionTitle>
      <Separator/>
      <SidebarSummary/>
      <Separator/>
      <SidebarFlow/>
    </div>
  );
};

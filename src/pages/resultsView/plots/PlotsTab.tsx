import PlotsTabComponent from './PlotsTabComponent';
import * as React from 'react';
import { ResultsViewPageStore } from '../ResultsViewPageStore';
import ResultsViewURLWrapper from '../ResultsViewURLWrapper';

export interface IPlotsTabProps {
    store: ResultsViewPageStore;
    urlWrapper: ResultsViewURLWrapper;
}

export default class PlotsTab extends React.Component<IPlotsTabProps, {}> {
    render() {
        return (
            <PlotsTabComponent
                store={this.props.store}
                urlWrapper={this.props.urlWrapper}
            />
        );
    }
}

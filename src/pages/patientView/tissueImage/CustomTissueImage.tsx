import * as React from 'react';
import { PathologyReportPDF } from '../clinicalInformation/PatientViewPageStore';
import { If, Then, Else } from 'react-if';
import _ from 'lodash';
import IFrameLoader from '../../../shared/components/iframeLoader/IFrameLoader';
import { observer } from 'mobx-react';

export type IPathologyReportProps = {
    iframeHeight: number;
    iframeStyle?: { [styleProp: string]: any };
};

@observer
export default class CustomTissueImage extends React.Component<
    IPathologyReportProps,
    {
        imageData: { status: number; message: string; data: string[] };
        studyId: any;
        caseId: any;
        loading: boolean;
    }
> {
    pdfSelectList: any;
    pdfEmbed: any;

    constructor(props: IPathologyReportProps) {
        super(props);

        this.state = {
            imageData: { status: 0, message: '', data: [] },
            studyId: '',
            caseId: '',
            loading: true,
        };
    }

    componentDidMount() {
        const fetchData = async () => {
            const searchParams = new URLSearchParams(document.location.search);

            const studyId = searchParams.get('studyId');
            const caseId = searchParams.get('caseId');

            this.setState({ studyId: studyId, caseId: caseId });

            const response = await fetch(
                `https://ilabportal-file-uploader.crunchyapps.com/get-files/${studyId}/${caseId}`
            );
            const jsonResponse = await response.json();

            if (jsonResponse.status) {
                this.setState({ imageData: jsonResponse });
            }

            this.setState({ loading: false });
        };

        fetchData();
    }

    render() {
        return (
            <div>
                {this.state.loading ? (
                    <p>Loading...</p>
                ) : this.state.imageData.status ? (
                    <>
                        {this.state.imageData.data.length === 0 ? (
                            <p>No images found for this case id</p>
                        ) : (
                            <>
                                {this.state.imageData.data.map(
                                    (single: string) => (
                                        <img
                                            src={`https://ilabportal-file-uploader.crunchyapps.com/uploads/${this.state.studyId}/${this.state.caseId}/images/${single}`}
                                            alt=""
                                            key={single}
                                        />
                                    )
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p>
                        Error Occurered: Most probably you have not uploaded any
                        images for this case id of this study
                    </p>
                )}
            </div>
        );
    }
}

import React from 'react';
import authService from '../../../services/auth/auth.service';

const ReportCoverage: React.FC = () => {

    const [accessToken, setAccessToken] = React.useState<string>('')

    React.useEffect(() => {
        authService.getAuthToken().then((a) => {
            setAccessToken(a as string);
        });
    }, [])

    return (
        <div className="sqlServer">
            <div className="title-block">
                <h4 className="p-0">Coverage Report</h4>
            </div>
            <div className="main-card">
                <p>Report</p>
            </div>
        </div>
    );
};

export default ReportCoverage;

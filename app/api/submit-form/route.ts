import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Destructure body to match columns
        // META
        const {
            submissionId,
            timestamp,
            // SECTION 1
            brandName,
            foundedYear,
            coreProducts,
            northStar,
            brandArchetype,
            competitors,
            // SECTION 2
            growthGoals,
            targetAudience,
            growthBottlenecks,
            growthBottlenecksOther,
            // SECTION 3
            existingAssets,
            assetsConsistency,
            brandTone,
            explorationInterests,
            // SECTION 4
            activeChannels,
            marketingExplorations,
            marketingStrategyStyle,
            // SECTION 5
            priorityContentTypes,
            productionStylePreference,
            preProductionNeeds,
            postProductionEnhancements,
            // SECTION 6
            existingDigitalCapabilities,
            websitePurpose,
            digitalInterests,
            // SECTION 7
            wantsAudit,
            workingWithAgencies,
            collaborationNotes,
            openToBundle,
            nextPhaseServices,
            // SECTION 8
            satisfactionDefinition,
            unsolvedProblems
        } = body;

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        if (!spreadsheetId) {
            return NextResponse.json({ error: 'Spreadsheet ID not configured' }, { status: 500 });
        }

        // Helper to join arrays
        const join = (arr: any) => Array.isArray(arr) ? arr.join(', ') : arr;

        const values = [
            [
                timestamp,
                submissionId,
                brandName,
                foundedYear,
                coreProducts,
                northStar,
                brandArchetype,
                competitors,
                join(growthGoals),
                targetAudience,
                join(growthBottlenecks) + (growthBottlenecksOther ? `, Other: ${growthBottlenecksOther}` : ''),
                join(existingAssets),
                assetsConsistency,
                join(brandTone),
                join(explorationInterests),
                join(activeChannels),
                join(marketingExplorations),
                marketingStrategyStyle,
                join(priorityContentTypes),
                productionStylePreference,
                join(preProductionNeeds),
                join(postProductionEnhancements),
                join(existingDigitalCapabilities),
                websitePurpose,
                join(digitalInterests),
                wantsAudit,
                workingWithAgencies,
                collaborationNotes,
                openToBundle,
                join(nextPhaseServices),
                satisfactionDefinition,
                unsolvedProblems
            ]
        ];

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A1', // Assumes Sheet1. Appends to end.
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });

        return NextResponse.json({ success: true, data: response.data });
    } catch (error: any) {
        console.error('Google Sheets Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

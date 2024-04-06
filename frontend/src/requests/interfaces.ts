export interface HostedZone {
    Id: string;
    Name: string;
    CallerReference: string;
    Config: {
      Comment: string;
      PrivateZone: boolean;
    };
    ResourceRecordSetCount: number;
  }
  
 export interface HostedZonesResponse {
    $metadata: {
      httpStatusCode: number;
      requestId: string;
      attempts: number;
      totalRetryDelay: number;
    };
    HostedZones: HostedZone[];
    IsTruncated: boolean;
    MaxItems: number;
  }
import { EventsResponse } from "../../../api/services/scheduling";


export const mockAppointments: EventsResponse = {
  total: 1,
  events: [
    {
      "id": "2d7782ff-9519-4b65-8ccb-2a69d293274b",
      "practiceId": "98436372-6d89-4f1e-bb03-3002ad6dfb3e",
      "providerId": "670fd97e-731a-4ff8-b747-ba288b1c5adf",
      "patientServiceId": "3465e0ae-90f3-400f-be97-0d24e3c40837",
      "patientServiceName": "Cognitive behavioral therapy",
      "patientId": "dc75eb8d-b31a-4e02-b17a-cddd63e68841",
      "patientName": "Jane Doe",
      "patientEmail": "test@test.com",
      "patientNumber": "",
      "additionalParticipants": [],
      "location": "Online",
      "color": "green",
      "timeZone": "Africa/Johannesburg",
      "startTime": "2024-09-27T10:30:00Z",
      "endTime": "2024-09-27T11:30:00Z",
      "status": "Confirmed",
      "cancellationReason": null,
      "cancellationDetails": null,
      "price": 46.0,
      "discount": null,
      "clientType": "Existing",
      "providerName": "John Doe",
      "patientServiceType": "Individual",
      "onlineMeetingProvider": "Trova Meet",
      "onlineMeetUrl": "https://devmeet.trovahealth.app/client-join?key=caf159b45da0a0e0f60e1047d4a97d1d61fa57b6",
      "onlineMeetProviderUrl": "https://devmeet.trovahealth.app/provider?key=caf159b45da0a0e0f60e1047d4a97d1d61fa57b6",
      "allDay": false,
      "appointmentNumber": "00001785",
      "invoiceDataId": "",
      "patientArchived": false
    }
  ]
};
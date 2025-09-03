import { eventsControllerFactory } from "./events.controller";
import { getPreferences } from "../services/preferences.service";
import { getZodError, isTimeBetween } from "../utils/utils";

// Mock external dependencies
jest.mock("../services/preferences.service");
jest.mock("../utils/utils");

// Mock the express app and its methods
const mockPost = jest.fn();
const mockApp = { post: mockPost } as any;

// Mock the response object and its methods
const mockSend = jest.fn()
const mockStatus = jest.fn(()=>({send: mockSend}))
const mockRes = { status: mockStatus } as any;

// Mock the request object
const mockReq = { body: {} } as any

// Mock the EventType
jest.mock("../models/events.model", ()=>{
    const z = jest.requireActual("zod")
    const MOCK_EVENT_TYPE = "event_type";
    const MockEventTypeSchema = z.enum([MOCK_EVENT_TYPE]);
    const actualModule = jest.requireActual("../models/events.model")
    return {
        ...actualModule,
        EventSchema: actualModule.EventSchema.extend({
            eventType: MockEventTypeSchema,
        })
    }
})
import { EventSchema } from "../models/events.model";


// Cast mocks to Jest mock functions
const mockGetPreferences = getPreferences as jest.Mock
const mockIsTimeBetween = isTimeBetween as jest.Mock
const mockGetZodError = getZodError as jest.Mock

describe("eventsController", () => {
    beforeEach(()=>{
        jest.clearAllMocks();
        eventsControllerFactory(mockApp);
    })

    test("should process the notification if the user is subscribed and DND is inactive", ()=>{
      // Setup
      mockGetPreferences.mockReturnValue({
        eventSettings: {
            event_type: { enabled: true },
        },
        dnd: { start: "22:00", end: "08:00"},
      })  
      mockIsTimeBetween.mockReturnValue(false)

      mockReq.body = {
        userId: "usr_12345",
        eventId: "evt_abcde",
        timestamp: "2025-01-01T19:00:00Z",
        eventType: "event_type",
      }

      // Action
      const postHandler = mockPost.mock.calls[0][1];
      postHandler(mockReq,mockRes)

      // Assertions
      expect(mockStatus).toHaveBeenCalledWith(202);
      expect(mockSend).toHaveBeenCalledWith({
        decision: "PROCESS_NOTIFICATION"
      })
    })

    test("should not notify if the user is unsubscribed from the event type", ()=>{
      // Setup
      mockGetPreferences.mockReturnValue({
        eventSettings: {
            event_type: { enabled: false },
        },
        dnd: { start: "22:00", end: "08:00"},
      })  
      mockIsTimeBetween.mockReturnValue(false)

      mockReq.body = {
        userId: "usr_12345",
        eventId: "evt_abcde",
        timestamp: "2025-01-01T19:00:00Z",
        eventType: "event_type",
      }

      // Action
      const postHandler = mockPost.mock.calls[0][1];
      postHandler(mockReq,mockRes)

      // Assertions
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith({
        decision: "DO_NOT_NOTIFY",
        reason: "USER_UNSUBSCRIBED_FROM_EVENT",
      })
      
    })

    test("should not notify if DND is active", ()=>{
      // Setup
      mockGetPreferences.mockReturnValue({
        eventSettings: {
            event_type: { enabled: true },
        },
        dnd: { start: "22:00", end: "08:00"},
      })  
      mockIsTimeBetween.mockReturnValue(true)

      mockReq.body = {
        userId: "usr_12345",
        eventId: "evt_abcde",
        timestamp: "2025-01-01T23:00:00Z",
        eventType: "event_type",
      }

      // Action
      const postHandler = mockPost.mock.calls[0][1];
      postHandler(mockReq,mockRes)

      // Assertions
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith({
        decision: "DO_NOT_NOTIFY",
        reason: "DND_ACTIVE",
      })
    })

    test("should return a 400 error for an invalid event body", () => {
        // Setup 
        mockGetZodError.mockReturnValue({error:{issues:[]}})

        mockReq.body = {
            userId: "usr_12345",
            eventId: "evt_abcde",
            timestamp: "23:30",
            eventType: "event_type",
        }

        // Action
        const postHandler = mockPost.mock.calls[0][1]
        postHandler(mockReq,mockRes)

        // Assertion
        expect(mockStatus).toHaveBeenCalledWith(400)
        expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(Object)}))
    })

    test("should return a 500 error for unexpected failures", () => {
        // Setup
        // Mocking an internal error
        mockGetPreferences.mockImplementation(()=>{
            throw new Error("Internal server error");
        });
         mockReq.body = {
            userId: "usr_12345",
            eventId: "evt_abcde",
            timestamp: "2005-04-02T21:37:00Z",
            eventType: "event_type",
        }
        
        // Action
        const postHandler = mockPost.mock.calls[0][1]
        postHandler(mockReq,mockRes)

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({error: expect.any(Error)}))
    })
})
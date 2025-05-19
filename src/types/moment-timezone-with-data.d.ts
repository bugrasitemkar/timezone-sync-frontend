import 'moment';
import 'moment-timezone';

declare module 'moment-timezone/builds/moment-timezone-with-data' {
    import { Moment } from 'moment';
    import { Moment as MomentTimezone } from 'moment-timezone';

    const momentTimezone: Moment & MomentTimezone;
    export default momentTimezone;
} 
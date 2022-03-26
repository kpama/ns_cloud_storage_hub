/**
 * @NApiVersion 2.1
 */
define(['N/currentRecord', 'N/record'],
    /**
 * @param{currentRecord} currentRecordModule
 * @param{record} recordModule
 */
    (currentRecordModule, recordModule) => {

        /**
         * Return list of NetSuite record that may have 
         * 
         * @return { Object }
         */
        const getEntityTypes = () => {
            return {
                COMPETITOR: recordModule.Type.COMPETITOR,
                CUSTOMER: recordModule.Type.CUSTOMER,
                EMPLOYEE: recordModule.Type.EMPLOYEE,
                LEAD: recordModule.Type.LEAD,
                PROSPECT: recordModule.Type.PROSPECT,
                PARTNER: recordModule.Type.PARTNER,
                VENDOR: recordModule.Type.VENDOR,
            }
        }

        const isEntity = (record) => {
            if (!record) {
                return false;
            }

            try {
                return Object.values(getEntityTypes()).indexOf(record.type) > -1;
            } catch (e) {
                log.error({
                    title: 'Could not determine if record is an entity',
                    details: {
                        message: e.message,
                        error: e
                    }
                })
            }

            return false;
        }

        return {
            getEntityTypes,
            isEntity,
        }

    });

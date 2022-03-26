/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([
    'N/record',
    'N/ui/serverWidget',
    'N/runtime',
    './libs/entity_helper'
],
    /**
    * @param { record } recordModule
    * @param { serverWidget } serverWidgetModule 
    * @param { runtime } runtimeModule 
    */
    (recordModule, serverWidgetModule, runtimeModule, entityHelperModule) => {
        const URL_PARAM_NAME = 'custscript_cfg_ncsh_url'
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            addUiToForm(scriptContext);
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        /**
         * 
         * @param {Object} scriptContext
         */
        const addUiToForm = (scriptContext) => {
            if (scriptContext.type !== scriptContext.UserEventType.CREATE) {
                const script = runtimeModule.getCurrentScript();
                const TAB_ID = 'custpage_kpama_external_storage_tab';
                const url = script.getParameter({
                    name: URL_PARAM_NAME 
                })

                if (!url) {
                    return; // Don't shows the external storage tab
                }

                scriptContext.form.addTab({
                    id: TAB_ID,
                    label: 'Cloud Storage'
                });

                if (entityHelperModule.isEntity(scriptContext.newRecord)) {
                    addFilesTabFields(addFileSubTab(TAB_ID, scriptContext), scriptContext)
                    addPermissionTabFields(addPermissionSubTab(TAB_ID, scriptContext), scriptContext);
                } else {
                    addFilesTabFields(TAB_ID, scriptContext);
                }
            }
        }


        function addFileSubTab(tabId, scriptContext) {
            const id = 'custpage_kpama_external_storage_tab_files';
            scriptContext.form.addSubtab({
                id,
                tab: tabId,
                label: 'Files'
            })

            return id;
        }

        function addFilesTabFields(containerId, scriptContext) {
            const script = runtimeModule.getCurrentScript();
            const url = script.getParameter({
                name: URL_PARAM_NAME 
            })
            const user = runtimeModule.getCurrentUser();
            const iframeField = scriptContext.form.addField({
                id:  'custpage_ncsh_files_iframe',
                type: serverWidgetModule.FieldType.INLINEHTML,
                label: 'Cloud Files',
                container: containerId
            })

            // load the external content
            iframeField.defaultValue = `<iframe src="${url}/external/front/${user.role}/${user.id}/${scriptContext.newRecord.type}/${scriptContext.newRecord.id}" style="width: 100%; min-height: 600px; border: none; overflow: auto;">
             </iframe>`;
        }

        function addPermissionSubTab(tabId, scriptContext) {
            const id = 'custpage_kpama_external_storage_tab_settings';
            scriptContext.form.addSubtab({
                id,
                tab: tabId,
                label: 'Permission and settings'
            });
            return id
        }

        function addPermissionTabFields(containerId, scriptContext) {
            // fake field just for testing
            scriptContext.form.addField({
                id: 'custpage_settings',
                type: serverWidgetModule.FieldType.TEXT,
                label: 'Fake field',
                container: containerId 
            })
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });

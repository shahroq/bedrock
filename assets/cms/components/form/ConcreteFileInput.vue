<template>
    <div class="ccm-item-selector-group">
        <input type="hidden" :name="inputName" :value="selectedFileID" />

        <div class="ccm-item-selector-choose" v-if="!selectedFile && !isLoading">
            <button type="button" @click="openChooser" class="btn btn-secondary">
                {{chooseText}}
            </button>
        </div>

        <div v-if="isLoading">
            <div class="btn-group">
                <div class="btn btn-secondary"><svg class="ccm-loader-dots"><use xlink:href="#icon-loader-circles" /></svg></div>
                <button type="button" @click="clearFile" class="ccm-item-selector-reset btn btn-secondary">
                    <i class="fa fa-times-circle"></i>
                </button>
            </div>
        </div>

        <div class="ccm-item-selector-loaded" v-if="selectedFile !== null">
            <div class="btn-group">
                <a :href="selectedFile.urlDetail" target="_blank" class="btn btn-secondary">
                    <span v-html="selectedFile.resultsThumbnailImg"></span>
                    <span class="ccm-item-selector-title">{{selectedFile.title}}</span>
                </a>
                <button type="button" @click="selectedFileID = null" class="ccm-item-selector-reset btn btn-secondary">
                    <i class="fa fa-times-circle"></i>
                </button>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            isLoading: false,
            isFirstRun: true, // need to differentiate in order to only run change within the selectedFileID watcher not on first run. Probably better to just refactor this component.
            selectedFile: null /* json object */,
            selectedFileID: 0 /* integer */
        }
    },
    props: {
        inputName: {
            type: String,
            required: true
        },
        fileId: {
            type: Number
        },
        chooseText: {
            type: String
        },
        filters: {
            type: Array
        }
    },
    watch: {
        selectedFileID: {
            immediate: true,
            handler(value) {
                if (value > 0) {
                    this.loadFile(value)
                    if (!this.isFirstRun) {
                        this.$emit('change', value)
                    }
                } else {
                    this.selectedFile = null
                    if (!this.isFirstRun) {
                        this.$emit('change', null)
                    }
                }
                if (!this.isFirstRun) {
                    // Fire the jQuery change event.
                    // @deprecated - do not use this unless you have to. Use this component directly instead and listen
                    // to its change event. This will be removed when the jQuery dependency is removed.
                    $('input[name=' + this.inputName + ']').trigger('change')
                }
                this.isFirstRun = false
            }
        }
    },
    mounted() {
        if (this.fileId) {
            this.selectedFileID = this.fileId
        }
    },
    methods: {
        chooseFile: function(selectedFiles) {
            this.selectedFileID = selectedFiles[0]
        },
        openChooser: function() {
            var my = this
            var options = {}
            if (my.filters) {
                options.filters = my.filters
            }
            ConcreteFileManager.launchDialog(function(r) {
                my.loadFile(r.fID)
            }, options)
        },
        clearFile: function() {
            this.selectedFileID = null
            this.$emit('selectedfile', null)
        },
        loadFile(fileId) {
            var my = this
            my.isLoading = true
            ConcreteFileManager.getFileDetails(fileId, function (r) {
                my.selectedFile = r.files[0]
                my.selectedFileID = fileId
                my.isLoading = false
                my.$emit('selectedfile', r.files[0])
            })
        }

    }
}
</script>

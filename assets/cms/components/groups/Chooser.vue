<template>
    <div class="ccm-ui">
        <div class="mb-3 ccm-header-search-form">
            <form method="get" @submit="performSearch">
                <div class="input-group">
                    <input type="search" v-model="searchKeywords" :placeholder="i18n.search" class="form-control border-end-0" autocomplete="off">
                    <button type="submit" class="input-group-icon">
                        <svg width="16" height="16">
                            <use xlink:href="#icon-search"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
        <div v-if="searchSubmitted">
            <div v-if="searchSubmitted === true">
                <div v-if="searchResults.length > 0">
                    <table class="border-top ccm-search-results-table">
                        <thead>
                        <tr>
                            <th>{{ i18n.id }}</th>
                            <th class="w-100">{{ i18n.name }}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr @click="selectSearchResult(group)" class="ccm-search-results-hoverable" v-for="group in searchResults" :key="group.gID">
                            <td>{{group.gID}}</td>
                            <td>{{group.gDisplayName}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else>
                    {{ i18n.noResults }}
                </div>
            </div>
            <div v-show="searchSubmitted === 'searching'">
                <svg class="ccm-loader-dots"><use xlink:href="#icon-loader-circles" /></svg>
            </div>
        </div>
        <div v-else>
            <div v-show="treeID > 0">
                <div data-tree="group">
                </div>
            </div>
            <div v-show="treeID === 0">
                <svg class="ccm-loader-dots"><use xlink:href="#icon-loader-circles" /></svg>
            </div>
        </div>

    </div>
</template>

<script>
/* eslint-disable no-new */
export default {
    components: {
    },
    props: {
        mode: {
            type: String,
            required: false,
            default: 'default' /* values are default or select */
        }
    },
    data() {
        return {
            i18n: {
                search: 'Search',
                id: 'ID',
                name: 'Name',
                noResults: 'No results found.'
            },
            searchKeywords: '',
            searchResults: [],
            searchSubmitted: false,
            treeID: 0
        }
    },
    watch: {
        treeID: function() {
            var my = this
            var options = {
                treeID: my.treeID,
                enableDragAndDrop: false
            }
            if (my.mode === 'select') {
                options.onClick = function(node) {
                    if (node.data.gID) {
                        my.triggerSelect(node.data.gID, node.title)
                    } else {
                        return false
                    }
                }
            }
            $('[data-tree=group]').concreteTree(options)
        }
    },
    mounted() {
        if (window.ccmi18n_groups) {
            for (const key in this.i18n) {
                if (window.ccmi18n_groups[key]) {
                    this.i18n[key] = window.ccmi18n_groups[key]
                }
            }
        }
        var my = this
        new ConcreteAjaxRequest({
            method: 'POST',
            url: CCM_DISPATCHER_FILENAME + '/ccm/system/group/chooser/tree',
            data: {
                ccm_token: CCM_SECURITY_TOKEN
            },
            success: function (r) {
                my.treeID = r.treeID
            }
        })
    },
    methods: {
        selectSearchResult(group) {
            if (this.mode === 'default') {
                window.location.href = CCM_DISPATCHER_FILENAME + '/dashboard/users/groups/edit/' + group.gID
            }
            if (this.mode === 'select') {
                this.triggerSelect(group.gID, group.gDisplayName)
            }
        },
        triggerSelect(gID, gName) {
            ConcreteEvent.publish('SelectGroup', { gID: gID, gName: gName })
            this.$emit('select', { gID: gID, gName: gName })
        },
        performSearch(event) {
            this.searchSubmitted = 'searching'
            event.preventDefault()
            var my = this
            new ConcreteAjaxRequest({
                url: CCM_DISPATCHER_FILENAME + '/ccm/system/group/chooser/search',
                method: 'POST',
                data: {
                    ccm_token: CCM_SECURITY_TOKEN,
                    keywords: my.searchKeywords
                },
                success: function (r) {
                    my.searchSubmitted = true
                    my.searchResults = r
                }
            })
        }
    }
}
</script>

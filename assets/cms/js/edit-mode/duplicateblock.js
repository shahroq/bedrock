/* eslint-disable no-new, no-unused-vars, camelcase */
/* global _, Concrete, ConcreteEvent, ConcretePanelManager, CCM_SECURITY_TOKEN, CCM_DISPATCHER_FILENAME */

import _ from 'underscore'

;(function(window, $) {
    'use strict'

    /**
     * ClipBoard block used in panels
     * @type {Function}
     */
    var DuplicateBlock = Concrete.DuplicateBlock = function DuplicateBlock(elem, edit_mode, default_area) {
        this.init.apply(this, _.toArray(arguments))
    }

    DuplicateBlock.prototype = _.extend(Object.create(Concrete.BlockType.prototype), {

        init: function duplicateBlockInit(elem, edit_mode, default_area) {
            var my = this
            Concrete.BlockType.prototype.init.call(my, elem, edit_mode, elem.find('.block-content'), default_area)
        },

        handleDefaultArea: function() {
            var my = this
            $.pep.unbind(my.getPeper())
            my.getPeper().click(function (e) {
                my.handleClick()

                return false
            }).css({
                cursor: 'pointer'
            }).children('.block-name').css({
                cursor: 'pointer'
            })
        },

        removeElement: function() {
            this.getElem().remove()
        },

        addToDragArea: function DuplicateBlockAddToDragArea(drag_area) {
            var my = this; var elem = my.getElem()
            var block_type_id = elem.data('btid')
            var area = drag_area.getArea()
            var area_handle = area.getHandle()
            var dragAreaBlockID = 0
            var cID = elem.data('cid')
            var dragAreaBlock = drag_area.getBlock()
            var pcID = elem.data('pcid')

            if (dragAreaBlock) {
                dragAreaBlockID = dragAreaBlock.getId()
            }

            ConcretePanelManager.exitPanelMode()
            $.fn.dialog.closeAll()
            $.fn.dialog.showLoader()

            var settings = {
                cID: cID,
                arHandle: area_handle,
                btID: block_type_id,
                mode: 'edit',
                processBlock: 1,
                add: 1,
                btask: 'alias_existing_block',
                pcID: [pcID],
                ccm_token: CCM_SECURITY_TOKEN
            }
            if (dragAreaBlockID) {
                settings.dragAreaBlockID = dragAreaBlockID
            }
            $.getJSON(CCM_DISPATCHER_FILENAME, settings, function (response) {
                my.handleAddResponse(response, area, dragAreaBlock, function () {
                    ConcreteEvent.fire('EditModeAddClipboardComplete', {
                        block: my
                    })
                })
            })
        }
    })
})(window, jQuery); // eslint-disable-line semi

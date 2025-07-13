import '../Dropdown/Dropdown.scss'
import { ChevronRight } from 'lucide-react'

function Dropdown() {
    return (
        <>
            <div className="Section-Dropdown">
                {/* <!-- From Uiverse.io by 3bdel3ziz-T -->  */}
                <div className="select">
                    <div
                        class="selected"
                        data-default="All"
                        data-one="option-1"
                        data-two="option-2"
                        data-three="option-3">
                        <ChevronRight className="arrow" size={24} />
                        <h5>Tri </h5>
                    </div>
                    <div class="options">
                        <div title="all">
                            <input id="all" name="option" type="radio" checked="" />
                            <label class="option" for="all" data-txt="All"></label>
                        </div>
                        <div title="option-1">
                            <input id="option-1" name="option" type="radio" />
                            <label class="option" for="option-1" data-txt="option-1"></label>
                        </div>
                        <div title="option-2">
                            <input id="option-2" name="option" type="radio" />
                            <label class="option" for="option-2" data-txt="option-2"></label>
                        </div>
                        <div title="option-3">
                            <input id="option-3" name="option" type="radio" />
                            <label class="option" for="option-3" data-txt="option-3"></label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dropdown

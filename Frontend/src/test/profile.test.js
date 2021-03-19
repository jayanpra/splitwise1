import { render, fireEvent } from '@testing-library/react'
import ProfileMetric from '../components/profile/profileMetric'

it("RenderCheck", () => {
    const {queryByTitle} = render(<ProfileMetric/>);
    
})